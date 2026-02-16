import React, { useEffect } from "react";
import { X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import {
    useUpdateUpdatesMutation,
    useGetUpdatesByIdQuery,
} from "../../redux/Admin/AdminApi";
import { toast } from "react-toastify";

const EditUpdatesModel = ({ isOpen, onClose, updateId }) => {
    if (!isOpen || !updateId) return null;

    const [updateUpdate, { isLoading }] = useUpdateUpdatesMutation();
    const { data } = useGetUpdatesByIdQuery(updateId);

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (data) {
            reset({
                Headline: data?.data?.Headline,
                Subheadline: data?.data?.Subheadline,
                Description: data?.data?.Description,
            });
        }
    }, [data, reset]);

    const onSubmit = async (form) => {
        const formData = new FormData();

        formData.append("Headline", form.Headline);
        formData.append("Subheadline", form.Subheadline);
        formData.append("Description", form.Description);

        if (form.Image?.length) {
            formData.append("Image", form.Image[0]);
        }

        try {
            const res = await updateUpdate({
                id: updateId,
                data: formData,
            });

            if (res.error) {
                toast.error("Error in Update");
            } else {
                toast.success("Update Updated");
                onClose();
            }
        } catch (err) {
            toast.error("Error in Update");
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500"
                >
                    <X size={18} />
                </button>

                <h2 className="text-xl font-bold mb-6">Edit Update</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <input
                        {...register("Headline")}
                        placeholder="Headline"
                        className="w-full bg-gray-100 px-4 py-3 rounded-lg"
                    />

                    <input
                        {...register("Subheadline")}
                        placeholder="Subheadline"
                        className="w-full bg-gray-100 px-4 py-3 rounded-lg"
                    />

                    <textarea
                        {...register("Description")}
                        placeholder="Description"
                        rows={4}
                        className="w-full bg-gray-100 px-4 py-3 rounded-lg resize-none"
                    />

                    <label className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-lg cursor-pointer">
                        <Upload size={16} />
                        Change Image
                        <input {...register("Image")} type="file" hidden />
                    </label>


                    <button
                        disabled={isLoading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg"
                    >
                        {isLoading ? "Updating..." : "Update"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditUpdatesModel;