import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdOutlineEdit } from "react-icons/md";
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';


const WorkoutDetails = ({ workout }: { workout: any }) => {

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const { dispatch } = useWorkoutsContext();

  const handleClick = async() => {
    const confirmed = confirm('Are you sure you want to remove ' + workout.title.toUpperCase() + ' workout?');
    if (confirmed) {
      const response = await fetch(`${apiUrl}/api/workouts/` + workout._id, {
        method: 'DELETE'
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'DELETE_WORKOUT', payload: json });
      }
    }
  }

  const handleEdit = async() => {
    const confirmed = confirm('Are you sure you want to edit ' + workout.title.toUpperCase() + ' workout?'); 
    if (confirmed) {
      dispatch({ type: 'SET_WORKOUT_TO_EDIT', payload: workout });

      // Open modal ONLY on small screens (e.g. width < 768px, which is Tailwind's `md`)
      if (window.innerWidth < 768) {
        dispatch({ type: 'SET_MODAL_OPEN', payload: true });
      }
    }
  }

  return (
      <div key={workout._id} className="bg-white shadow-md rounded-sm p-4 mb-4">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold text-teal-600">{workout.title.toUpperCase()}</h3>
          <div className="flex gap-2">
            <span onClick={handleEdit} className="border hover:border-gray-800 border-gray-300 hover:bg-gray-200 hover:cursor-pointer bg-gray-300 rounded-full p-1">
              <MdOutlineEdit  size={25} />
            </span>
            <span onClick={handleClick} className="border hover:border-gray-800 border-gray-300 hover:bg-gray-200 hover:cursor-pointer bg-gray-300 rounded-full p-1">
              <RiDeleteBin6Line  size={25} />
            </span>
          </div>
        </div>
        <p><strong>Load (kg):</strong> {workout.load > 0 ? workout.load : '0'}</p>
        <p><strong>Reps:</strong> {workout.reps}</p>
        <p className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
        </p>
      </div>
  )
}

export default WorkoutDetails;