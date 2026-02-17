import { useState, useMemo } from "react";
import {
  Plus,
  FileText,
  List,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import CategoryModel from "./AddCategoryModel";
import AddSupportModel from "./AddSupportModel";
import {
  useGetAllSupportsQuery,
  useGetAllCategoryQuery,
  useDeletcategoryMutation,
  useDeleteSupportMutation,
} from "../../redux/Admin/AdminApi";
import { toast } from "react-toastify";
import EditCategory from "./EditCategory";

const SupportCategories = () => {
  const [showModal, setShowModal] = useState(false);
  const [openAddSupport, setOpenAddSupport] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCatId, setDeleteCatId] = useState(null);
  const [delsupportId, setdelsupportId] = useState(null);

  const { data: categoryData } = useGetAllCategoryQuery();
  const { data: supportData } = useGetAllSupportsQuery();

  const [deleteCategory, { isLoading: deletingCategory }] =
    useDeletcategoryMutation();
  const [deleteSupport, { isLoading: deletingSupport }] =
    useDeleteSupportMutation();

  const categories = categoryData?.data || [];

  const supports = supportData?.data || [];
  const totalSupports = supportData?.totalSupports || 0;
  const categoryCounts = supportData?.categoryCounts || [];

  const totalCategories = categories.length;

  // ✅ FINAL SAFE MAPPING
  const categoryWithSupports = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,

      supports: supports.filter(
        (s) => String(s.CategoryId?._id) === String(cat._id),
      ),

      supportCount:
        categoryCounts.find((c) => String(c.categoryId) === String(cat._id))
          ?.count || 0,
    }));
  }, [categories, supports, categoryCounts]);

  const handleDeleteCategory = async (id) => {
    try {
      setDeleteCatId(id);
      await deleteCategory(id).unwrap();
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeleteCatId(null);
    }
  };

  const handleDeleteSupport = async (id) => {
    try {
      setdelsupportId(id); // ✅ FIXED
      await deleteSupport(id).unwrap();
      toast.success("Support deleted");
    } catch {
      toast.error("Failed to delete support");
    } finally {
      setdelsupportId(null);
    }
  };

  return (
    <div className="bg-[#F3FFF7] p-6 rounded-2xl w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Support Categories & Types</h2>
          <p className="text-gray-500">
            Manage categories and support types for users
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setOpenAddSupport(true)}
            className="flex items-center gap-2 border border-green-600 text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50"
          >
            <Plus size={16} /> Add Support
          </button>

          <button
            onClick={() => {
              setEditCategory(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 flex items-center gap-4 border-l-4 border-green-500">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <FileText className="text-green-600" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Categories</p>
            <p className="text-xl font-bold">{totalCategories}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 flex items-center gap-4 border-l-4 border-green-500">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <List className="text-green-600" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Supports</p>
            <p className="text-xl font-bold">{totalSupports}</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categoryWithSupports.map((cat) => {
          const isOpen = openCategory === cat._id;

          return (
            <div
              key={cat._id}
              className={`rounded-2xl border ${
                isOpen ? "bg-[#F1FFE7] border-green-300" : "bg-white"
              }`}
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={cat.Image}
                    alt={cat.categoryName}
                    className="w-12 h-12 rounded-xl object-cover"
                  />

                  <div>
                    <p className="font-semibold text-lg">{cat.categoryName}</p>
                    <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      {cat.supportCount} Supports
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditCategory(cat);
                      setShowModal(true);
                    }}
                    className="border border-green-600 text-green-600 p-2 rounded-lg hover:bg-green-50"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                  >
                    {deletingCategory && deleteCatId === cat._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>

                  <button
                    onClick={() => setOpenCategory(isOpen ? null : cat._id)}
                  >
                    {isOpen ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="px-5 pb-5 flex flex-wrap gap-3">
                  {cat.supports.map((sup) => (
                    <span
                      key={sup._id}
                      className="flex items-center gap-2 px-4 py-2 border border-green-500 rounded-full text-sm font-semibold text-green-600 bg-white"
                    >
                      {sup.SupportName}

                      {deletingSupport && delsupportId === sup._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2
                          size={14}
                          onClick={() => handleDeleteSupport(sup._id)}
                          className="text-red-500 cursor-pointer"
                        />
                      )}
                    </span>
                  ))}

                  {cat.supports.length === 0 && (
                    <p className="text-gray-500 text-sm">No supports found</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {showModal && editCategory && (
        <EditCategory
          editData={editCategory}
          onClose={() => {
            setShowModal(false);
            setEditCategory(null);
          }}
        />
      )}

      <AddSupportModel
        isOpen={openAddSupport}
        onClose={() => setOpenAddSupport(false)}
      />
    </div>
  );
};

export default SupportCategories;
