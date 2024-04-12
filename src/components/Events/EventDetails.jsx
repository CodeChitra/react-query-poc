import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "../Header.jsx";
import { deleteEvent, fetchEvent, queryClient } from "../../../utils/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", `event-${id}`],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const {
    mutate,
    isPending: isDeletePending,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: "none"
      });
      navigate("/events");
    },
  });

  const handleDelete = () => {
    mutate({ id });
  };
  let content;
  if (data) {
    content = (
      <article id="event-details">
        <header>
          <h1>{data?.title}</h1>
          <nav>
            {isDeletePending && "Deleting..."}
            {isDeletePending || <button onClick={handleDelete}>Delete</button>}
            {isError && "Something Went Wrong!"}
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data?.image}`} alt="" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data?.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {data?.date}@{data?.time}
              </time>
            </div>
            <p id="event-details-description">{data?.description}</p>
          </div>
        </div>
      </article>
    );
  }
  if (isPending) {
    content = <p>Event is Loading please wait!</p>;
  }
  if (isError) {
    content = (
      <ErrorBlock
        title="Failed to fetch event!"
        message={error?.info.message}
      />
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {content}
    </>
  );
}
