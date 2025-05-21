import React, { useState, useEffect } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';

// Toast component
const Toast = ({
  message,
  onClose,
  isMobile,
}: {
  message: string;
  onClose: () => void;
  isMobile?: boolean;
}) => (
  <div
    className={`fixed z-[9999] ${
      isMobile
        ? 'bottom-6 left-1/2 -translate-x-1/2 w-[90vw] max-w-xs'
        : 'top-6 right-6'
    }`}
  >
    <div className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
      <span>✅</span>
      <span>{message}</span>
      <button
        className="ml-4 text-white hover:text-gray-200 font-bold"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  </div>
);

const WorkoutForm = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const { dispatch, workoutToEdit } = useWorkoutsContext();

    const [title, setTitle] = useState('');
    const [load, setLoad] = useState('');
    const [reps, setReps] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [emptyFields, setEmptyFields] = useState<string[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (workoutToEdit) {
            setTitle(workoutToEdit.title);
            setLoad(workoutToEdit.load.toString());
            setReps(workoutToEdit.reps.toString());
        } else {
            setTitle('');
            setLoad('');
            setReps('');
        }
    }, [workoutToEdit]);

    useEffect(() => {
      // Detect mobile screen
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
      if (showToast) {
        const timer = setTimeout(() => setShowToast(false), 2500);
        return () => clearTimeout(timer);
      }
    }, [showToast]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const workoutData = { title, load, reps };
        const method = workoutToEdit ? 'PATCH' : 'POST';
        const url = workoutToEdit ? `${apiUrl}/api/workouts/${workoutToEdit._id}` : `${apiUrl}/api/workouts`;

        const response = await fetch(url, {
            method: method,
            body: JSON.stringify(workoutData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields || []);
        }
        if (response.ok) {
            setTitle('');
            setLoad('');
            setReps('');
            setError(null);
            setEmptyFields([]);
            setShowToast(true);

            if (workoutToEdit) {
                dispatch({ type: 'EDIT_WORKOUT', payload: json });
                dispatch({ type: 'SET_WORKOUT_TO_EDIT', payload: null });
            } else {
                dispatch({ type: 'CREATE_WORKOUT', payload: json });
            }

            if (window.innerWidth < 768) {
                // On mobile, delay closing the modal so the toast is visible
                setTimeout(() => {
                    dispatch({ type: 'SET_MODAL_OPEN', payload: false });
                }, 1800); // Toast is visible for 2.5s, close modal after 1.8s
            } else {
                // On desktop, close modal immediately
                dispatch({ type: 'SET_MODAL_OPEN', payload: false });
            }
        }
    };

    return (
      <>
        {showToast && (
          <Toast
            message={workoutToEdit ? "Workout updated successfully!" : "Workout added successfully!"}
            onClose={() => setShowToast(false)}
            isMobile={isMobile}
          />
        )}
        <form
            className="flex flex-col gap-4 bg-white rounded-xl shadow-lg p-6"
            onSubmit={handleSubmit}
        >
            <h3 className="text-2xl font-bold text-teal-700 mb-2">
                {workoutToEdit ? 'Edit Workout' : 'Add a New Workout'}
            </h3>

            <div>
                <label className="block text-gray-700 font-semibold mb-1">Exercise Title</label>
                <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    placeholder="e.g. Bench Press"
                    className={`w-full p-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                        emptyFields.includes('title')
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-300 bg-white'
                    }`}
                />
            </div>

            <div>
                <label className="block text-gray-700 font-semibold mb-1">Load (kg)</label>
                <input
                    type="number"
                    onChange={(e) => setLoad(e.target.value)}
                    value={load}
                    placeholder="e.g. 60"
                    className={`w-full p-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                        emptyFields.includes('load')
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-300 bg-white'
                    }`}
                />
            </div>

            <div>
                <label className="block text-gray-700 font-semibold mb-1">Reps</label>
                <input
                    type="number"
                    onChange={(e) => setReps(e.target.value)}
                    value={reps}
                    placeholder="e.g. 12"
                    className={`w-full p-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                        emptyFields.includes('reps')
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-300 bg-white'
                    }`}
                />
            </div>

            <div className="flex items-center justify-between mt-2">
                <button
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold px-6 py-2 rounded-full shadow hover:from-teal-600 hover:to-cyan-600 transition"
                    type="submit"
                >
                    {workoutToEdit ? 'Update Workout' : 'Add Workout'}
                </button>
                {workoutToEdit && (
                    <span
                        className="underline text-orange-500 hover:text-orange-400 cursor-pointer ml-4"
                        onClick={() => {
                            dispatch({ type: 'SET_WORKOUT_TO_EDIT', payload: null });
                            if (window.innerWidth < 768) {
                                dispatch({ type: 'SET_MODAL_OPEN', payload: false });
                            }
                            setTitle('');
                            setLoad('');
                            setReps('');
                            setError(null);
                            setEmptyFields([]);
                        }}
                    >
                        Cancel Edit
                    </span>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-400 text-red-600 rounded-lg text-sm p-3 mt-2">
                    {error}
                </div>
            )}
        </form>
      </>
    );
};

export default WorkoutForm;