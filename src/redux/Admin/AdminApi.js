import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "adminapi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
    credentials: "include",
  }),

  // ✅ FIXED TAG TYPES (support + category + video etc properly aligned)
  tagTypes: [
    "projects",
    "users",
    "job",
    "leave",
    "User",
    "support",
    "category",
    "video",
    "updates",
    "donations",
  ],

  endpoints: (builder) => ({
    // ================= ADMIN AUTH =================
    registerAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/create-admin",
        method: "POST",
        body: data,
      }),
    }),

    loginAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    VerifyOtp: builder.mutation({
      query: (data) => ({
        url: "/admin/auth/verifyAdminOtp",
        method: "POST",
        body: data,
      }),
    }),

    logoutAdmin: builder.mutation({
      query: () => ({
        url: "admin/auth/logout",
        method: "POST",
      }),
    }),

    // ================= CATEGORY =================
    AddCategory: builder.mutation({
      query: (data) => ({
        url: "/Category/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    GetAllCategory: builder.query({
      query: () => ({
        url: "/Category/getall",
        method: "GET",
      }),
      providesTags: ["category"],
    }),

    UpdateCategory: builder.mutation({
      query: ({ data, id }) => ({
        url: `/Category/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    Deletcategory: builder.mutation({
      query: (id) => ({
        url: `/Category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),

    // ================= USERS =================
    GetAllUsers: builder.query({
      query: ({ page = 1, categoryId }) => ({
        url: "/user/auth/getAllUsers",
        method: "GET",
        params: {
          page,
          ...(categoryId && categoryId !== "All" && { categoryId }),
        },
      }),
      providesTags: ["users"],
    }),

    GetUserById: builder.query({
      query: (id) => `/user/auth/getUserById/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateStatus: builder.mutation({
      query: ({ id, currentStatus }) => ({
        url: `/user/auth/UpdateApprovedRejected/${id}`,
        method: "PUT",
        body: { currentStatus },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    // ================= DASHBOARD =================
    GetDashboardSummary: builder.query({
      query: () => ({
        url: "/AdminDashboard/dashboard/summary",
        method: "GET",
      }),
    }),

    // ================= VIDEO =================
    GetAllVideoInfo: builder.query({
      query: () => ({
        url: "/videoInfo/getall",
        method: "GET",
      }),
      providesTags: ["video"],
    }),

    DeleteVideoInfo: builder.mutation({
      query: (id) => ({
        url: `/videoInfo/video/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["video"],
    }),

    AddVideoInfo: builder.mutation({
      query: (data) => ({
        url: "/videoInfo/videos",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["video"],
    }),

    UpdateVideoInfo: builder.mutation({
      query: ({ data, id }) => ({
        url: `/videoInfo/videos/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["video"],
    }),

    GetVideoById: builder.query({
      query: (id) => ({
        url: `/videoInfo/video/${id}`,
        method: "GET",
      }),
    }),

    // ================= DAILY UPDATES =================
    GetAllUpdates: builder.query({
      query: () => ({
        url: "/DailyUpdate/getall",
        method: "GET",
      }),
      providesTags: ["updates"],
    }),

    AddUpdates: builder.mutation({
      query: (data) => ({
        url: "/DailyUpdate/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["updates"],
    }),

    UpdateUpdates: builder.mutation({
      query: ({ data, id }) => ({
        url: `/DailyUpdate/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["updates"],
    }),

    GetUpdatesById: builder.query({
      query: (id) => ({
        url: `/DailyUpdate/get/${id}`,
        method: "GET",
      }),
    }),

    DeleteUpdates: builder.mutation({
      query: (id) => ({
        url: `/DailyUpdate/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["updates"],
    }),

    // ================= SUPPORT (🔥 FIXED PART) =================

    AddSupport: builder.mutation({
      query: (data) => ({
        url: "/Support/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["support"],
    }),

    // ✅ MAIN FIX — USING CORRECT BACKEND AGGREGATION API
    GetAllSupports: builder.query({
      query: () => ({
        url: "/Support/getall",
        method: "GET",
      }),
      providesTags: ["support"],
    }),

    DeleteSupport: builder.mutation({
      query: (id) => ({
        url: `/Support/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["support"],
    }),

    // ================= Get All Scheema Support Requests of support request panel ===================  //
    GetAllSheemaSupports: builder.query({
      query: ({ page = 1, status }) => ({
        url: "/ScheemSupport/getAllSheemaSupports",
        method: "GET",
        params: {
          page,
          ...(status && status !== "All" && { status }),
        },
      }),
      providesTags: ["Supports"],
    }),

    // ================= SCHEME SUPPORT STATUS =================
    UpdateSupportStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/ScheemSupport/updateRequestUser/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Supports"],
    }),

    // ================= DONATIONS =================
    getAllDonations: builder.query({
      query: ({ page = 1, category }) => ({
        url: "/Donation/donations",
        method: "GET",
        params: {
          page,
          ...(category && category !== "All" && { category }),
        },
      }),
      providesTags: ["donations"],
    }),

    updateDonationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/Donation/donations/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["donations"],
    }),
  }),
});

// ================= EXPORT HOOKS =================
export const {
  useRegisterAdminMutation,
  useLoginAdminMutation,
  useVerifyOtpMutation,
  useLogoutAdminMutation,
  useAddCategoryMutation,
  useGetAllUsersQuery,
  useGetAllCategoryQuery,
  useUpdateStatusMutation,
  useGetAllVideoInfoQuery,
  useDeleteVideoInfoMutation,
  useAddVideoInfoMutation,
  useUpdateVideoInfoMutation,
  useGetVideoByIdQuery,
  useGetAllUpdatesQuery,
  useAddUpdatesMutation,
  useUpdateUpdatesMutation,
  useGetUpdatesByIdQuery,
  useDeleteUpdatesMutation,
  useGetAllSupportsQuery,
  useAddSupportMutation,
  useGetAllSheemaSupportsQuery,
  useUpdateSupportStatusMutation,
  useUpdateCategoryMutation,
  useDeletcategoryMutation,
  useDeleteSupportMutation,
  useGetDashboardSummaryQuery,
  useGetUserByIdQuery,
  useGetAllDonationsQuery,
  useUpdateDonationStatusMutation,
} = apiSlice;
