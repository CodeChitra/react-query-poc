import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { queryClient, updateEvent } from "../../../utils/http.js";

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", `event-${id}`],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const { mutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const newEvent = data.event;
      await queryClient.cancelQueries({
        queryKey: ["events", `event-${id}`],
      });
      const previousEvent = queryClient.getQueriesData([
        "events",
        `event-${id}`,
      ]);
      queryClient.setQueryData(["events", `event-${id}`], newEvent);
      return { previousEvent };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(
        ["events", `event-${id}`],
        context.previousEvent
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["events", `event-${id}`]);
    },
  });

  function handleSubmit(formData) {
    mutate({ id, event: formData });
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  return (
    <Modal onClose={handleClose}>
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        {isUpdatePending && "Updating..."}
        {isUpdatePending || (
          <button type="submit" className="button">
            Update
          </button>
        )}
      </EventForm>
    </Modal>
  );
}
