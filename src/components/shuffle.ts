export function shuffle<T>(array: T[], seed: number): T[] {
    const newArray = [...array];
    let currSeed = seed;
    
    for (let i = newArray.length - 1; i > 0; i--) {
         const x = Math.abs(Math.sin(currSeed++) * 10000);
         const pseudoRandom = x - Math.floor(x);
         
         const j = Math.floor(pseudoRandom * (i + 1));
         [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}