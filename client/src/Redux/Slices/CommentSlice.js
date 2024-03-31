import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance.js";
import toast from "react-hot-toast";

const initialState = {
  comments: [],
  commentReplies: {},
  nestedReplies: {},
};

export const getLectureComments = createAsyncThunk(
  "/getComments",
  async (lectureId) => {
    try {
      const res = await axiosInstance.get(
        `/comments/getLectureComments/${lectureId}`
      );
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

export const addCommentInLecture = createAsyncThunk(
  "/addComment",
  async ({ content, lectureId }) => {
    console.log("innside getLectureComments", lectureId);
    const loadingMessage = toast.loading("Adding comment into lecture ...");
    try {
      const res = await axiosInstance.post(
        `/comments/addComment/${lectureId}`,
        {
          content,
        }
      );
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

export const addReplyInComment = createAsyncThunk(
  "/addReply",
  async ({ content, commentId }) => {
    const loadingMessage = toast.loading("Adding reply into comment ...");
    try {
      const res = await axiosInstance.post(
        `/comments/addReplyToComment/${commentId}`,
        {
          content,
        }
      );
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

export const getReplysOfComment = createAsyncThunk(
  "/getReplys",
  async ({ commentData }) => {
    console.log("comment data", commentData);
    const loadingMessage = toast.loading(
      "wait getting reply for this comment ..."
    );
    try {
      const res = await axiosInstance.get(
        `/comments/getReplys/${commentData._id}`
      );
      toast.success(res?.data?.message, { id: loadingMessage });
      return { commentData, replies: res?.data };
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    toggleIsShowReplies: (state, action) => {
      const id = action.payload;

      const commentIndex = state.comments.findIndex((c) => c._id == id);
      console.log("commentIndex", commentIndex);
      if (commentIndex !== -1) {
        state.comments[commentIndex].isShowReplies =
          !state.comments[commentIndex].isShowReplies;
      } else {
        console.log("karenge");
        // state.nestedReplies[id] = state.nestedReplies[id];
        console.log("after", state.nestedReplies[id].isShowReplies);
        state.nestedReplies[id] = {
          ...state.nestedReplies[id],
          isShowReplies: !state.nestedReplies[id].isShowReplies,
        };
        console.log("before", state.nestedReplies[id].isShowReplies);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLectureComments.fulfilled, (state, action) => {
        console.log("hi", action.payload);
        state.comments = action.payload.data.map((comment) => ({
          ...comment,
          isShowReplies: false,
        }));
      })
      .addCase(addCommentInLecture.fulfilled, (state, action) => {
        state.comments.push(action.payload.data);
      })
      .addCase(getReplysOfComment.fulfilled, (state, action) => {
        console.log("lund", action.payload);
        const { commentData, replies } = action.payload;
        if (replies.data.length !== 0) {
          state.commentReplies[commentData._id] = replies.data.map((reply) => ({
            ...reply,
            isShowReplies: false,
          }));
        }
        if (commentData.parentComment) {
          state.nestedReplies[commentData._id] = commentData;
        }
      });
  },
});

export default commentSlice.reducer;

export const { toggleIsShowReplies } = commentSlice.actions;