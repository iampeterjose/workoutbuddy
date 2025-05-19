import { createContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";

// Define workout type
type Workout = {
  _id: string;
  title: string;
  load: number;
  reps: number;
  createdAt: string;
};

// Define state and actions
type State = {
  workouts: Workout[] | null;
  workoutToEdit: Workout | null;
  isModalOpen: boolean;
};

type Action =
  | { type: "SET_WORKOUTS"; payload: Workout[] }
  | { type: "CREATE_WORKOUT"; payload: Workout }
  | { type: "EDIT_WORKOUT"; payload: Workout }
  | { type: "DELETE_WORKOUT"; payload: { _id: string } }
  | { type: "SET_WORKOUT_TO_EDIT"; payload: Workout | null }
  | { type: "SET_MODAL_OPEN"; payload: boolean }

type WorkoutsContextType = State & {
  dispatch: Dispatch<Action>;
};

// Create context with default undefined (will be handled in hook)
export const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined);

// Context Provider Props
type WorkoutsContextProviderProps = {
  children: ReactNode;
};

// Reducer
export const workoutsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_WORKOUTS":
      return { ...state, workouts: action.payload };
    case "CREATE_WORKOUT":
      return {
        ...state, workouts: state.workouts ? [action.payload, ...state.workouts] : [action.payload],
      };
    case "EDIT_WORKOUT":
      return {
        ...state, workouts: state.workouts
          ? state.workouts.map((w) => w._id === action.payload._id ? action.payload : w)
          : [],
      };
    case "DELETE_WORKOUT":
        return {
          ...state, workouts: state.workouts ? state.workouts.filter((workout) => workout._id !== action.payload._id) : [],
        };
    case "SET_WORKOUT_TO_EDIT":
      return {
        ...state, workoutToEdit: action.payload,
      };
    case "SET_MODAL_OPEN":
      return {
        ...state, isModalOpen: action.payload,
      };
    default:
      return state;
  }
};

// Provider
export const WorkoutsContextProvider = ({ children }: WorkoutsContextProviderProps) => {
  const [state, dispatch] = useReducer(workoutsReducer, {
    workouts: null,
    workoutToEdit: null,
    isModalOpen: false,
  });

  return (
    <WorkoutsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WorkoutsContext.Provider>
  );
};
