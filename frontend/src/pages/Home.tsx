import { useState, useEffect } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';

import { IoAddSharp } from "react-icons/io5";

// components
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutFormModal from '../components/WorkoutFormModal';

const Home = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const { workouts, dispatch, isModalOpen, workoutToEdit } = useWorkoutsContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch(`${apiUrl}/api/workouts`);
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_WORKOUTS', payload: json });
        setLoading(false);  
      }
    }

    fetchWorkouts();
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isModalOpen) {
        dispatch({ type: 'SET_MODAL_OPEN', payload: false });
      }
    };

    window.addEventListener('resize', handleResize);

    // Run once on mount in case screen is already large
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, isModalOpen]);

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 768;
      if (isSmallScreen && workoutToEdit) {
        dispatch({ type: 'SET_MODAL_OPEN', payload: true });
      }
    };

    window.addEventListener('resize', handleResize);

    // Also check immediately in case user already resized before this mounted
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [workoutToEdit, dispatch]);

  return (
    <div className='flex flex-col items-center py-4 px-2 md:px-0'>
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-teal-700 mb-2">My Workouts</h1>
        <p className="text-gray-600">Track and manage your workouts easily.</p>
      </header>
      <div className='flex md:flex-row flex-col gap-16 items-start justify-center w-full'>
        <div className='w-full md:w-1/2'>
          {loading && (
            <div className="flex justify-center items-center h-32">
              <span className="text-teal-600 text-lg">Loading...</span>
            </div>
          )}

          {!loading && workouts && workouts.length === 0 && (
            <div className='flex flex-col items-center justify-center gap-2'>
              <span className="text-5xl">🏋️‍♂️</span>
              <p>No workouts found.</p>
              <button
                onClick={() => dispatch({ type: "SET_MODAL_OPEN", payload: true })}
                className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-teal-500 transition md:hidden"
              >
                <IoAddSharp size={20} />
                Add Workout
              </button>
            </div>
          )}

          {!loading && workouts && workouts.length > 0 && (
            <>
              <div className='flex items-center justify-between mb-4'>
                <button
                  onClick={() => dispatch({ type: "SET_MODAL_OPEN", payload: true })}
                  className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-teal-500 transition md:hidden"
                >
                  <IoAddSharp size={20} />
                  Add Workout
                </button>
              </div>
              <div>
                {workouts.map((workout: any) => (
                  <div key={workout._id} className="mb-4 bg-white rounded-lg shadow p-4">
                    <WorkoutDetails workout={workout} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className='hidden md:block md:w-1/2 w-full'>
          <WorkoutForm />
        </div>
        {/* Modal for mobile */}
        <WorkoutFormModal open={isModalOpen} onClose={() => dispatch({ type: "SET_MODAL_OPEN", payload: false })} />
      </div>
    </div>
  );
}

export default Home;