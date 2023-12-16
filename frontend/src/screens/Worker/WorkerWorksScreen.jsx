import {
  useGetWorksQuery,
  useMakeworksReadMutation,
} from "../../slices/workApiSlice";
import Loader from "../../components/Loader/Loader";
import WorkCard from "../../components/WorkCard/WorkCard";
import Pagination from "../../components/Pagination/Pagination";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SearchBar from "../../components/SeachBar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { eventRefetchWorks } from "../../slices/socketEventsSlice";
import { Form } from "react-bootstrap";

const WorkerWorksScreen = () => {
  const [works, setWorks] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [showExpired, setShowExpired] = useState(false);

  const searchQuery = (value) => {
    setQuery(value);
  };

  const setPageNumber = (page) => {
    setPage(page);
  };

  const dispatch = useDispatch();
  const { refetchWorks } = useSelector((state) => state.socketEvents);

  const {
    data,
    isLoading: loadingWorks,
    error,
    refetch,
  } = useGetWorksQuery({
    page,
    query,
    showExpired,
  });

  const [makeWorksRead, { isLoading }] = useMakeworksReadMutation();

  useEffect(() => {
    if (data) {
      setWorks(data.works);
      setPage(data.page);
      setPages(data.pages);
    }
    if (refetchWorks) {
      refetch();
      dispatch(eventRefetchWorks(false));
    }
    if (error) toast.error(error);

    return () => {
      if (data) {
        const ids = data?.works
          .filter((value) => (value.isRead ? false : value._id))
          .map((value) => value._id);

        if (ids.length > 0) {
          try {
            makeWorksRead({ ids }).unwrap();
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
        }
      }
    };
  }, [data, refetchWorks, dispatch]);

  return isLoading || loadingWorks ? (
    <Loader />
  ) : (
    <div className="position-relative">
      <div className="w-100 my-4">
        <SearchBar placeholder={"Search works.."} method={searchQuery} />
      </div>
      <Form.Group className="mb-3 mt-4 d-flex" controlId="checkbox1">
        <Form.Check
          type="checkbox"
          label="Show expired works"
          onChange={() => setShowExpired(!showExpired)}
        />
      </Form.Group>
      {works &&
        works.map((work, key) => {
          return (
            <WorkCard
              work={work.work[0]}
              key={key}
              isRead={work.isRead}
              customer={work.customer}
            />
          );
        })}

      <Pagination pages={pages} page={page} method={setPageNumber} />
    </div>
  );
};

export default WorkerWorksScreen;
