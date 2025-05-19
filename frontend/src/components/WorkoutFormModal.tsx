import WorkoutForm from "./WorkoutForm";

type WorkoutFormModalProps = {
  open: boolean;
  onClose: () => void;
};

const WorkoutFormModal = ({ open, onClose }: WorkoutFormModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 relative w-full max-w-md">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <WorkoutForm />
      </div>
    </div>
  );
};

export default WorkoutFormModal;