import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdOutlineEdit } from "react-icons/md";
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

const WorkoutDetails = ({ workout }: { workout: any }) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const { dispatch } = useWorkoutsContext();

  const handleClick = async () => {
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

  const handleEdit = async () => {
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
    <div className="relative bg-gradient-to-br from-teal-50 to-white rounded-xl shadow-lg p-6 transition hover:shadow-xl">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-2xl font-extrabold text-teal-700 tracking-wide">{workout.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            title="Edit"
            className="bg-cyan-100 hover:bg-cyan-200 text-teal-700 rounded-full p-2 shadow transition border border-transparent hover:border-cyan-400"
          >
            <MdOutlineEdit size={22} />
          </button>
          <button
            onClick={handleClick}
            title="Delete"
            className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 shadow transition border border-transparent hover:border-red-400"
          >
            <RiDeleteBin6Line size={22} />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Load:</span>
          <span className="text-gray-900">{workout.load > 0 ? workout.load : '0'} <span className="text-xs text-gray-500">kg</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Reps:</span>
          <span className="text-gray-900">{workout.reps}</span>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-500 italic">
        {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
      </div>
    </div>
  );
}

export default WorkoutDetails;