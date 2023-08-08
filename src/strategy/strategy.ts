import {
  UnspentOutput,
} from '../client/client';

export const strategy0 = (outputs: UnspentOutput[], purchaseAmount: number) => {
  let foundCombination: UnspentOutput[] = [];

  const backtrack = (start: number, currCombination: UnspentOutput[], currSum: number) => {
    if (currSum - purchaseAmount === 0) {
      foundCombination = [...currCombination];
      return true; // Stop searching if a valid combination is found
    }

    // If the current sum !== purchase amount,
    // the function enters a loop to loop over the remaining values.
    for (let i = start; i < outputs.length; i++) {
      // Check if adding it to the current sum would still
      // keep the sum less than or equal to the target sum
      if (currSum + outputs[i].value <= purchaseAmount) {
        currCombination.push(outputs[i]);

        // Update start, currCombination and currSum
        // and call the backtrack function again (Recursion)
        if (backtrack(i + 1, currCombination, currSum + outputs[i].value)) {
          return true; // Stop searching if a valid combination is found
        }

        // Remove last number of the combination so that it can explore other possibilities
        currCombination.pop();
      }
    }
    return false; // Stop searching if it is confirmed no available combination
  };

  backtrack(0, [], 0);
  return foundCombination;
};

export const strategy1 = (outputs: UnspentOutput[], purchaseAmount: number) => {
  let amount = purchaseAmount;
  const selectedOutputs = outputs.reduce((result: UnspentOutput[], output: UnspentOutput) => {
    if (purchaseAmount >= output.value) {
      result.push(output);
      amount -= output.value;
    }
    return result;
  }, []);
  if (amount !== 0) {
    return [] as UnspentOutput[];
  }
  return selectedOutputs;
};

export const strategy2 = (outputs: UnspentOutput[], purchaseAmount: number) => (
  outputs.find((output) => output.value >= purchaseAmount)
);
