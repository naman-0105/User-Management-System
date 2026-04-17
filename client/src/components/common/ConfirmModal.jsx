import Button from "../ui/Button";

export default function ConfirmModal({ open, title, description, onCancel, onConfirm }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
