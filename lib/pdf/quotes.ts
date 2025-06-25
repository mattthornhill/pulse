export const leadershipQuotes = [
  {
    text: "What gets measured gets managed.",
    author: "Peter Drucker"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    text: "Culture eats strategy for breakfast.",
    author: "Peter Drucker"
  },
  {
    text: "Routine sets you free.",
    author: "Verne Harnish"
  },
  {
    text: "Cash is to a business as oxygen is to a person.",
    author: "Verne Harnish"
  },
  {
    text: "The main thing is to keep the main thing the main thing.",
    author: "Stephen Covey"
  },
  {
    text: "In God we trust. All others must bring data.",
    author: "W. Edwards Deming"
  },
  {
    text: "Without data, you're just another person with an opinion.",
    author: "W. Edwards Deming"
  },
  {
    text: "Success is a few simple disciplines, practiced every day.",
    author: "Jim Rohn"
  },
  {
    text: "What you cannot measure, you cannot manage.",
    author: "Lord Kelvin"
  }
]

export function getRandomQuote() {
  return leadershipQuotes[Math.floor(Math.random() * leadershipQuotes.length)]
}