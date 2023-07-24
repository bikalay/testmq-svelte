import {Mutex} from "../mutex";

describe("Mutex", () => {
  it("Should run operations in order", async () => {
    const mutex = new Mutex();
    const result = [];

    const operation1 = async () => {
      const unlock = await mutex.lock();
      setTimeout(() => {
        result.push(1);
        unlock();
      }, 500);
    };

    const operation2 = async () => {
      const unlock = await mutex.lock();
      setTimeout(() => {
        result.push(2);
        unlock();
      }, 100);
    };

    operation1();
    operation2();

    await new Promise((r) => setTimeout(r, 1000));

    expect(result).toEqual([1, 2]);
  });
});
