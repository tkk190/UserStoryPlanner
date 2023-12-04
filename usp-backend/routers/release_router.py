from typing import Annotated, Literal, List
import toml

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from exporter.openproject import export_story, create_version
from models.database.release import Release
from models.database.story import Story
from models.database.step import Step
from models.database.project import Project
from models.request.release_write import ReleaseWrite
from models.response.possible_release_version import PossibleReleaseVersion
from utils import get_language_pack
from routers.router_utils import get_session, insert_status_history
from auth.dependencies import check_permission
from semver import Version

router = APIRouter(
    prefix="/release",
    tags=["release"],
    dependencies=[Depends(check_permission)]
)
MySession = Annotated[Session, Depends(get_session)]

ReleaseState = Literal["major", "minor", "patch", "prerelease", "build"]

lang_release = get_language_pack()


@router.post("/{id}/{type}")
def add(id: str, type: ReleaseState, session: MySession):
    old_release = session.get(Release, id)

    if old_release is None:
        raise HTTPException(404)
    old_release_version = Version.parse(old_release.name)

    match type:
        case "major":
            new_release_version = str(old_release_version.bump_major())
        case "minor":
            new_release_version = str(old_release_version.bump_minor())
        case "patch":
            new_release_version = str(old_release_version.bump_patch())
        case "prerelease":
            new_release_version = str(old_release_version.bump_prerelease())
        case "build":
            new_release_version = str(old_release_version.bump_build())
        case _:
            raise HTTPException(400, "wrong release-type")

    release_check = session.exec(
        select(Release)
        .where(Release.project_id == old_release.project_id)
        .where(Release.name == new_release_version)
    ).first()

    if release_check is not None:
        raise HTTPException(400, "release already exists")
    new_release = Release(name=new_release_version, project_id=old_release.project_id)
    session.add(new_release)
    session.commit()
    session.refresh(new_release)
    insert_status_history('', new_release.status, release_id=new_release.id)
    return new_release

@router.get("/check_possible_versions/{id}")
def check_release_options(id: int, session: MySession) -> List[PossibleReleaseVersion]:
    result = []

    old_release = session.get(Release, id)
    if old_release is None:
        raise HTTPException(404)
    old_release_version = Version.parse(old_release.name)

    for type in ["major", "minor", "patch", "prerelease", "build"]:
        match type:
            case "major":
                new_release_version = str(old_release_version.bump_major())
            case "minor":
                new_release_version = str(old_release_version.bump_minor())
            case "patch":
                new_release_version = str(old_release_version.bump_patch())
            case "prerelease":
                new_release_version = str(old_release_version.bump_prerelease())
            case "build":
                new_release_version = str(old_release_version.bump_build())
            case _:
                raise HTTPException(400, "wrong release-type")

        release_check = session.exec(
            select(Release)
            .where(Release.project_id == old_release.project_id)
            .where(Release.name == new_release_version)
        ).first()

        if release_check is None:
            result.append(PossibleReleaseVersion(type=type, version=new_release_version))

    return result

@router.patch("", response_model_by_alias=True)
def edit(request: ReleaseWrite, session: MySession):
    release = session.get(Release, request.id)
    if release is None:
        raise HTTPException(404, "release not found")
    if request.name is not None:
        release.name = request.name
    if request.status is not None:
        if request.status == 'running':
            if len(release.project.short_name) == 0:
                raise HTTPException(400, "no project short name defined")
            version = create_version(f"{release.project.short_name}_{release.name}")
            stories = session.exec(
                select(Story)
                .where(Story.release_id == request.id)
                .where(Story.status == 'planned')
            ).all()
            for story in stories:
                state = export_story(session, story.id, version=version)
                if state == True:
                    insert_status_history(story.status, 'exported', story_id=story.id)
        if request.status == 'done':
            check_stories = session.exec(
                select(Story)
                .where(Story.release_id == request.id)
                .where(Story.status != 'done')
                .where(Story.status != 'archived')
            ).all()
            if len(check_stories) > 0:
                raise HTTPException(400, 'all Stories must be done')
        if release.name == '1.0.0' and request.status == 'done':
            project = session.get(Project, release.project_id)
            insert_status_history(project.status, 'active', project_id=project.id)
            project.status = 'active'
        insert_status_history(release.status, request.status, release_id=release.id)
        release.status = request.status
    if request.project_id is not None:
        release.project_id = request.project_id
    session.commit()
    session.refresh(release)
    return release


@router.delete("/{id}")
def delete(id: str, session: MySession):
    old_release = session.get(Release, id)

    release_check = session.exec(
        select(Release)
        .where(Release.project_id == old_release.project_id)
    ).all()

    if len(release_check) == 1:
        new_release = Release(name='1.0.0', project_id=old_release.project_id)
        session.add(new_release)
        session.delete(old_release)
    else:
        old_release.status = 'archived'

    session.commit()

    if len(release_check) == 1:
        session.refresh(new_release)
        insert_status_history('', new_release.status, release_id=new_release.id)
    else:
        insert_status_history(old_release.status, 'archived', release_id=old_release.id)

@router.get("/notes/{id}")
def get_release_notes(id: int, session: MySession):
    release_notes = ''
    release_parts = {
        'bug': '',
        'feature': '',
        'refactor': '',
        'story': ''
    }
    results = session.exec(
        select(Story, Step)
        .join(Step)
        .where(Story.release_id == id)
        .where(Story.status != 'archived')
    ).all()

    for result in results:
        story: Story = result[0]
        step: Step = result[1]
        story_text = story.name
        if len(story.release_text):
            story_text = story.release_text
        # Bug, Feature, Refactor, Story
        release_parts[step.type] += f"- {story_text} \r\n"

    if len(release_parts['story']) > 0:
        release_notes += f"### {lang_release['story']}: \r\n {release_parts['story']}"
    if len(release_parts['bug']) > 0:
        release_notes += f"### {lang_release['bug']}: \r\n {release_parts['bug']}"
    if len(release_parts['feature']) > 0:
        release_notes += f"### {lang_release['feature']}: \r\n {release_parts['feature']}"
    if len(release_parts['refactor']) > 0:
        release_notes += f"### {lang_release['refactor']}: \r\n {release_parts['refactor']}"
    return release_notes


