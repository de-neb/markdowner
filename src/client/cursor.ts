import supabase from "./index";
import store from "../store";
import { toastActions } from "../store/slices/toast";
import { RealtimeChannel } from "@supabase/supabase-js";
import { CollaborationState } from "./type";

export const trackCursorPosition = async (payload: any): RealtimeChannel => {
  const channel = supabase.channel("document-collab-channel");

  channel.subscribe();

  await channel.track(payload);

  return channel;
};

export const sendCursorPosition = (payload: CollaborationState) => {
  const subscription = supabase.channel("document-collab-channel").send({
    type: "broadcast",
    event: "cursor-move",
    payload,
  });

  return subscription;
};

export const postCursorLocation = async (
  collaborationState: CollaborationState
) => {
  try {
    const { data, error } = await supabase
      .from("Collaboration State")
      .insert(collaborationState)
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    store.dispatch(
      toastActions.show({
        message: error.message,
        type: "error",
      })
    );
  }
};

export const updateCursorLocation = async (
  collaborationState: CollaborationState
) => {
  try {
    const { data, error } = await supabase
      .from("Collaboration State")
      .update({
        cursor_position: collaborationState.cursor_position,
      })
      .eq("document_id", collaborationState.document_id)
      .eq("user_id", collaborationState.user_id)
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    store.dispatch(
      toastActions.show({
        message: error.message,
        type: "error",
      })
    );
  }
};
