import mongoose from "mongoose";
import dotenv from "dotenv";
import Topic from "./src/models/Topic.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const topics = [
  { name: "Arrays" },
  { name: "Strings" },
  { name: "Hashing" },
  { name: "Two Pointers" },
  { name: "Sliding Window" },
  { name: "Binary Search" },
  { name: "Recursion" },
  { name: "Backtracking" },
  { name: "Stack" },
  { name: "Queue" },
  { name: "Linked List" },
  { name: "Trees" },
  { name: "Binary Trees" },
  { name: "Binary Search Trees" },
  { name: "Heap" },
  { name: "Priority Queue" },
  { name: "Graphs" },
  { name: "DFS" },
  { name: "BFS" },
  { name: "Dynamic Programming" },
  { name: "Greedy" },
  { name: "Bit Manipulation" },
  { name: "Trie" },
  { name: "Segment Tree" }
];

try {

  await Topic.deleteMany(); // clears old topics

  await Topic.insertMany(topics);

  console.log("DSA Topics inserted successfully");

  process.exit();

} catch (error) {

  console.error(error);
  process.exit(1);

}