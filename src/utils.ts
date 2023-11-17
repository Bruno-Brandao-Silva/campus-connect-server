String.prototype.toProperCase = function (): string {
    const words = this.toLowerCase().split(' ');
    const properCase = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return properCase;
}

export { }