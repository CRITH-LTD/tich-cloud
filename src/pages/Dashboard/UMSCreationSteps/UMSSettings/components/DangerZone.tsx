import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AlertTriangle, Info } from "lucide-react";
import { useDangerZone } from "../../../../../hooks/useDangerZone";
import { useUMSManagement } from "../../../dashboard.hooks";

type Props = {
    onDeleted?: () => void;
};

const DangerZone = ({ onDeleted }: Props) => {
    const { intro, introLoading } = useUMSManagement();

    // While loading or missing data, disable dangerous actions
    const dz = useDangerZone({
        ums: { id: intro?.id ?? "", name: intro?.name ?? "" },
        onDeleted,
    });

    const disabled = introLoading || !intro;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg border border-red-200 p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Danger Zone</span>
                </h3>

                <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-red-900">Delete UMS</p>
                                <p className="text-sm text-red-700">
                                    Permanently delete this UMS and all associated data.
                                </p>
                            </div>
                            <button
                                onClick={dz.open}
                                disabled={disabled}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-60"
                            >
                                Delete UMS
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-amber-900">Before you proceed</p>
                                <ul className="text-sm text-amber-700 mt-2 space-y-1">
                                    <li>• Make sure you have backed up all important data</li>
                                    <li>• These actions cannot be undone</li>
                                    <li>• All users will lose access immediately</li>
                                    <li>• Consider exporting data before deletion</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm dialog */}
            <Transition.Root show={dz.isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={dz.close}>
                    <Transition.Child as={Fragment} enter="transition-opacity ease-out duration-150" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="transition ease-out duration-150 transform" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-100 transform" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg border">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                        <div className="w-full">
                                            <Dialog.Title className="text-base font-semibold text-gray-900">
                                                Permanently delete{" "}
                                                <span className="text-red-700">{intro?.name ?? "this UMS"}</span>?
                                            </Dialog.Title>
                                            <Dialog.Description className="mt-1 text-sm text-gray-600">
                                                This action <strong>cannot</strong> be undone. This will permanently delete the UMS
                                                and remove all associated data and user access.
                                            </Dialog.Description>

                                            <div className="mt-4 space-y-4">
                                                <label className="block text-sm">
                                                    <span className="text-gray-700">
                                                        Please type <span className="font-semibold">{intro?.name}</span> to confirm:
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={dz.confirmText}
                                                        onChange={(e) => dz.setConfirmText(e.target.value)}
                                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
                                                        placeholder={intro?.name}
                                                        autoFocus
                                                    />
                                                </label>

                                                <label className="flex items-start gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        className="mt-0.5"
                                                        checked={dz.acknowledge}
                                                        onChange={(e) => dz.setAcknowledge(e.target.checked)}
                                                    />
                                                    <span className="text-gray-700">
                                                        I understand this will permanently delete all data and revoke access for all users.
                                                    </span>
                                                </label>

                                                {dz.error && (
                                                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                                        {dz.error}
                                                        <button onClick={dz.resetError} className="ml-2 underline underline-offset-2">
                                                            dismiss
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-6 flex items-center justify-end gap-3">
                                                <button
                                                    onClick={dz.close}
                                                    disabled={dz.isDeleting}
                                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={dz.deleteNow}
                                                    disabled={!dz.canDelete || dz.isDeleting}
                                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-60"
                                                >
                                                    {dz.isDeleting ? "Deleting…" : "I understand, delete this UMS"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default DangerZone;
