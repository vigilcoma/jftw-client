export function randomIntFrom(min: number, max: number): number {
    return Math.ceil(min + Math.random() * (max - min));
}

export function randomFloatFrom(min: number, max: number): number {
    return min + Math.random() * (max - min);
}