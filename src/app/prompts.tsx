export const allPrompts =
[
    [{
        gpt: "Give me a starting narration to my game where the player is a bored office worked looking to turn over a new leaf, then one day based on their wish they are transported to a new world. Their adventure begins in a village under attack by a dragon. Use 2nd person and max 120 words.",
        user: "Start Game",
        option: 0
    }],

    [{
        gpt: "Describe a vivid scene of me slaying a dragon with a sword to stop terrorizing a village (100 words or less, 2nd person)",
        user: "Pick up a nearby sword and slay the dragon",
        option: 0,
        Sword: 1,
        health: -1,
        strength: 1
    },
    {
        gpt: "Describe a vivid scene of me offering gold to a dragon which convinces it to stop terrorizing a village (100 words or less, 2nd person)",
        user: "Attempt to soothe the dragon by offering all your gold",
        option: 1,
        Gold: -5
    },
    {
        gpt: "Describe a vivid scene of me narrowly escaping a village being attacked by a dragon with my life (100 words or less, 2nd person)",
        user: "Flee the scene",
        option: 2,
    }],

    [{
        gpt: "Describe how after the player deals with the dragon, they enjoy their adventuring life for a couple of days before arriving at a bustling city (100 words or less, 2nd person)",
        user: "Leave the village",
        option: 0
    }],

    [{
        gpt: "Describe me going to the tavern after reaching a bustling city and when I get there, the barkeep convinces me to accept a request to defeat the Demon King that is terrorizing the lands (100 words or less, 2nd person)",
        user: "Head to the tavern",
        option: 0
    },
    {
        gpt: "Describe me going to the adventurer’s guild after reaching a bustling city and accept a request to defeat the Demon King that is terrorizing the lands (100 words or less, 2nd person)",
        user: "Head to the adventurer’s guild",
        option: 1
    }],

    [{
        gpt: "Describe me contemplating on my journey ahead to the Demon King’s castle (100 words or less, 2nd person)",
        user: "Think about how to get to the Demon King's castle",
        option: 0
    }],

    [{
        gpt: "Describe me taming a wild horse outside the city and embarking on an epic journey from the city to the Demon King’s castle on horseback (100 words or less, 2nd person)",
        user: "Tame a steed from the wild to go by horseback",
        option: 0
    },
    {
        gpt: "Describe me embarking on an epic journey from the city to the Demon King’s castle by boat (100 words or less, 2nd person)",
        user: "Go by boat",
        option: 1
    },
    {
        gpt: "Describe me embarking on an epic journey from the city to the Demon King’s castle by foot (100 words or less, 2nd person)",
        user: "Go by foot",
        option: 2
    }]
]


