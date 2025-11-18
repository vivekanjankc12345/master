import React from "react";

const DeleteModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-80 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-3 text-red-600">Delete Lead?</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this lead? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
