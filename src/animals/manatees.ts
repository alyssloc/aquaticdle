import type { Species } from '../components/types.ts';
export const MANATEE_DATA: Species[] = [
    {
        id: "amazonian-manatee",
        name: "Amazonian manatee",
        scientificName: "Trichechus inunguis",
        range: "Freshwater river systems of the Amazon Basin",
        clues: [
                "I lack nails on my flippers",
                "I am a vulnerable species",
                "I am commonly referred to as the 'cowfish'",
                "I live exclusively in freshwater",
                "I am known to vocalize, especially between a cow and calf",
                "I maintain a herbivorous diet"
            ]
    },
    {
        id: "african-manatee",
        name: "African manatee",
        scientificName: "Trichechus senegalensis",
        range: "Western Africa, from Senegal to Angola",
        clues: [
                "I am an omnivore",
                "I am a vulnerable species",
                "My main predator is the West African Crocodile",
                "I am nocturnal",
                "I am very social, spending a majority of my day bonding by touch, verbal communication, and smell",
                "My tail looks like a paddle"
            ]
    },
    {
        id: "west-indian-manatee",
        name: "West Indian manatee ",
        scientificName: "Trichechus manatus",
        range: "The southeastern United States through the Caribbean Sea to the northern coast of South America",
        clues: [
                "I have two subspecies",
                "I am a vulnerable species",
                "I inhabit inhabits mostly shallow coastal areas, including rivers and estuaries",
                "I lack predator avoidance behavior since I evolved in regions lacking natural predators",
                "I have vibrissae all over my bodies",
                "I am a obligate herbivore, and I graze for five or more hours a day"
            ]
    },
]