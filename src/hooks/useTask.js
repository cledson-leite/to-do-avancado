import { useContext } from "react";
import { TaskContext } from "../contexts/TaskContext";

export function useTask() {
  return useContext(TaskContext);
}
