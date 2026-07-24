import type { Species } from '../components/types.ts';
export const POLAR_BEAR_DATA: Species[] = [
    {
        id: "polar-bear",
        name: "Polar bear",
        family: "Ursidae",
        scientificName: "Ursus maritimus",
        range: "Northern polar region",
        clues: [
                "I am a threatened species",
                "I rely on having lots of body fat to stay warm",
                "I can live for up to 30 years in the wild",
                "I typically have two pups per litter",
                "I have white fur",
                "I am the largest living land carnivore"
            ]
    },
    {
        id: "tyrant-polar-bear",
        name: "Tyrant polar bear",
        family: "Ursidae",
        scientificName: "Ursus maritimus tyrannus",
        range: "Northern polar region",
        clues: [
                "I am exctinct",
                "I lived during the Late Pleistocene",
                "I was named in 1964 based on fossils",
                "Little is known about my behavior",
                "I was a large land carnivore",
                "I was a subspecies of Polar Bears"
            ]
    }
]