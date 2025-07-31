import { AlertTriangle, Info } from "lucide-react";

const DangerZone = () => {

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg border border-red-200 p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Danger Zone</span>
                </h3>

                <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-red-900">Delete UMS</p>
                                <p className="text-sm text-red-700">
                                    Permanently delete this UMS and all associated data
                                </p>
                            </div>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                                Delete UMS
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-start space-x-3">
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
        </div>
    );
}

export default DangerZone;