"use client";
import React, { useState, useEffect } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';

const WorkoutForm = () => {

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

    const { dispatch, workoutToEdit } = useWorkoutsContext();
    // State variables for form inputs
    const [title, setTitle] = useState('');
    const [load, setLoad] = useState('');
    const [reps, setReps] = useState('');
    const [error, setError] = useState(null);
    const [emtyFields, setEmptyFields] = useState<string[]>([]);

    // If workoutToEdit is not null, set the form fields to the workout data
    useEffect(() => {
        if (workoutToEdit) {
            setTitle(workoutToEdit.title);
            setLoad(workoutToEdit.load.toString());
            setReps(workoutToEdit.reps.toString());
        }
        else {
            setTitle('');
            setLoad('');
            setReps('');
        }
    }, [workoutToEdit]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const workoutData = { title, load, reps };

        const method = workoutToEdit ? 'PATCH' : 'POST';
        const url = workoutToEdit ? `${apiUrl}/api/workouts/${workoutToEdit._id}` : '/api/workouts';

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
            setEmptyFields(json.emptyFields);
        }
        if (response.ok) {
            // Clear the form fields
            setTitle('');
            setLoad('');
            setReps('');
            // Optionally, you can also handle the success response here
            setError(null);
            setEmptyFields([]);

            if (workoutToEdit) {
                // If editing, update the workout in the context
                dispatch({ type: 'EDIT_WORKOUT', payload: json });
                dispatch({ type: 'SET_WORKOUT_TO_EDIT', payload: null }); // Reset form
                dispatch({ type: 'SET_MODAL_OPEN', payload: false }); // Close modal after submit    
            }
            else {
                // If creating a new workout, add it to the context
                console.log('New workout added:', json);
                // Dispatch the new workout to the context
                dispatch({ type: 'CREATE_WORKOUT', payload: json });
                dispatch({ type: 'SET_MODAL_OPEN', payload: false }); //  Close modal after submit  
            }
        }
    }

    return (
        <form className='flex flex-col mb-4' onSubmit={handleSubmit}>
            <h3 className='text-xl font-bold pb-2'>
                {workoutToEdit ? 'Edit Workout' : 'Add a New Workout'}
            </h3>

            <label>Exercise Title: </label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emtyFields.includes('title') ? 'border border-red-500 rounded-sm p-2 mb-4' : 'border border-gray-300 rounded-sm p-2 mb-4'}
            />
            <label>Load (kg): </label>  
            <input
                type="number"
                onChange={(e) => setLoad(e.target.value)}
                value={load}
                className={emtyFields.includes('load') ? 'border border-red-500 rounded-sm p-2 mb-4' : 'border border-gray-300 rounded-sm p-2 mb-4'}
            />
            <label>Reps: </label>
            <input
                type="number"
                onChange={(e) => setReps(e.target.value)}
                value={reps}
                className={emtyFields.includes('reps') ? 'border border-red-500 rounded-sm p-2 mb-4' : 'border border-gray-300 rounded-sm p-2 mb-4'}
            />

            <div className='flex justify-between items-center'>
                <button className='border border-gray- bg-teal-600 hover:bg-teal-500 hover:cursor-pointer text-white rounded-sm p-2 mb-4 w-40'>
                {workoutToEdit ? 'Update Workout' : 'Add Workout'}
                </button>
                {workoutToEdit && (
                    <span className='underline text-orange-500 hover:text-orange-400 hover:cursor-pointer'
                        onClick={() => {
                            dispatch({ type: 'SET_WORKOUT_TO_EDIT', payload: null }); // Reset form
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

            {error && <div className="bg-red-50 border border-red-500 text-red-500 rounded-sm text-sm p-2">{error}</div>}
        </form>
    );
}

export default WorkoutForm;