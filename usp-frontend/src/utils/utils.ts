export function createRandomId() {
    const min = 10000
    const max = 99999
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function comparePosition( a:any, b:any ) {
    if ( a.position < b.position ){
        return -1;
    }
    if ( a.position > b.position ){
        return 1;
    }
    return 0;
}
