export interface Category {
    id : number,
    value : string
}

export interface CategoryList{
    status : number,
    success : string,
    data : Category[]
}
