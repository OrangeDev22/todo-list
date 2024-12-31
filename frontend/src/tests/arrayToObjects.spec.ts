import { fireEvent, render, screen } from "@testing-library/react";
import { arrayToObject } from "../utils/arrayToObject";

const dummyArray = [
  { id: 1, name: "first", tasks: [] },
  { id: 2, name: "second", tasks: [] },
  { id: 3, name: "third", tasks: [] },
  { id: 4, name: "fourth", tasks: [] },
  { id: 5, name: "fith", tasks: [] },
];

describe("Test array to object function", () => {
  it("converts array to object", () => {
    const result = arrayToObject(dummyArray);
    const expectedResult = {
      "1": { name: "first", tasks: [] },
      "2": { name: "second", tasks: [] },
      "3": { name: "third", tasks: [] },
      "4": { name: "fourth", tasks: [] },
      "5": { name: "fith", tasks: [] },
    };
    console.log("--result", result);
    expect(result).toEqual(expectedResult);
  });
});
