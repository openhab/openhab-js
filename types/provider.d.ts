export class AbstractProvider {
    constructor(type: any);
    typeName: any;
    javaType: any;
    register(): void;
    hostProvider: any;
    processHostProvider(hostProvider: any): any;
}
