export const generateDrillSet = (subset, totalCount = 25) => {
  const result = [...subset]; //result is an array it has the 5 random letter chosen
  while (result.length < totalCount) {
    const random = subset[Math.floor(Math.random() * subset.length)]; //choose one letter from the 5 letters
    result.push(random); //push it onto result array
  }
  //   for (let i = result.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [result[i], result[j]] = [result[j], result[i]];
  //   }
  return result;
};
