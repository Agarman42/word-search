const FACTS: Record<string, string> = {
  TIGER: 'Tigers can sprint up to 40 mph — but only for short bursts.',
  EAGLE: 'Eagles can see prey from two miles away.',
  WHALE: 'Blue whales are the largest animals ever known to have lived.',
  PIZZA: 'The first pizza delivery is believed to date back to 1889 in Naples.',
  SUSHI: 'Sushi originally began as a method of preserving fish in fermented rice.',
  SOCCER: 'Soccer is played by over 250 million people in more than 200 countries.',
  TENNIS: 'A tennis match can last over 11 hours — the longest on record.',
  OSCAR: 'The Oscar statuette weighs 8.5 pounds and is gold-plated bronze.',
  PARIS: 'Paris has been the capital of France for over 1,000 years.',
  TOKYO: 'Tokyo is the most populous metropolitan area in the world.',
  CHRISTMAS: 'Christmas trees became popular in the 16th century in Germany.',
  PANDA: 'Giant pandas spend up to 14 hours a day eating bamboo.',
  DOLPHIN: 'Dolphins sleep with one eye open — half their brain stays awake.',
  PENGUIN: 'Emperor penguins can dive over 500 meters deep.',
  BANANA: 'Bananas are berries; strawberries are not.',
  HONEY: 'Honey never spoils — edible honey was found in ancient Egyptian tombs.',
  MARATHON: 'The marathon distance was standardized at 26.2 miles for the 1908 Olympics.',
  HOCKEY: 'Ice hockey pucks are frozen before games to reduce bouncing.',
  COMEDY: 'The first known comedy film dates to 1895.',
  DESERT: 'Antarctica is technically the world\'s largest desert.',
  VOLCANO: 'There are more than 1,500 potentially active volcanoes worldwide.',
  DRAGON: 'Dragon myths appear independently in cultures across every continent.',
  RAINBOW: 'A double rainbow reverses the color order in the outer arc.',
};

export function getWordFact(word: string): string | null {
  return FACTS[word.toUpperCase()] ?? null;
}

export function getGenericFact(category: string): string {
  const generics: Record<string, string> = {
    animals: 'Scientists discover thousands of new species every year.',
    food: 'The average person makes over 200 food-related decisions daily.',
    sports: 'The Olympic Games have been held every four years since 1896.',
    movies: 'The first movie with synchronized sound was The Jazz Singer in 1927.',
    geography: 'There are 195 countries recognized by the United Nations.',
    kids: 'Children ask an average of 300 questions per day.',
    holiday: 'Over 2 billion people celebrate Christmas worldwide.',
    science: 'Your body has around 37 trillion cells working in concert.',
    music: 'The oldest known musical instrument is over 40,000 years old.',
    nature: 'A single mature oak tree can support hundreds of species.',
    space: 'There are more stars in the universe than grains of sand on Earth.',
    books: 'The longest novel ever published has over 9 million words.',
  };
  return generics[category] ?? 'Every word has a story waiting to be discovered.';
}