function capitalizeSentences(text: string): string {
  return text
    .split(/([.!?]\s+)/) // pisahkan berdasarkan titik, tanda seru, atau tanda tanya
    .map(sentence =>
      sentence.charAt(0).toUpperCase() + sentence.slice(1)
    )
    .join("");
}
export default capitalizeSentences;