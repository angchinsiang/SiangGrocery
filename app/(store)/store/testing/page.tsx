"use client";
import { delRedis, testRedis } from "@/actions/redisTest";

const id = "f1517ce8-a759-4c7c-8933-be5b7b639db1";
const TestingPage = () => {
  return (
    <div className="p-4">
      <button
        className="bg-black text-white p-4 rounded-lg cursor-pointer"
        onClick={async () => {
          await testRedis(id);
          alert("Redis Test");
        }}
      >
        Test Redis
      </button>
      <button
        className="bg-black text-white p-4 rounded-lg cursor-pointer"
        onClick={async () => {
          await delRedis(id);
          alert("Redis Delete");
        }}
      >
        Delete Redis
      </button>
    </div>
  );
};

export default TestingPage;
