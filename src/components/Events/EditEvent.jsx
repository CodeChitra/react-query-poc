import { Link, useNavigate, useParams } from 'react-router-dom';
import {useQuery, useMutation} from "@tanstack/react-query";
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { updateEvent } from '../../../utils/http.js';

export default function EditEvent() {

  const navigate = useNavigate();
  const {id} = useParams()
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", `event-${id}`],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const {mutate, isPending: isUpdatePending} = useMutation({
    mutationFn: updateEvent
  })

  function handleSubmit(formData) {
    mutate({id, event: formData})
    navigate("../");
  }

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        {isUpdatePending && "Updating..."}
        {isUpdatePending || <button type="submit" className="button" onClick={handleSubmit}>
          Update
        </button>}
      </EventForm>
    </Modal>
  );
}
