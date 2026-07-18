export interface SignInResponse {
    status : number,
    success : string,
    data : {
        userId : string,
        firstName: string,
        lastName: string,
        email: string,
        token : string
    }
}
