import buttonsPaginationStyle from "./buttons-pagination.module.css";
import { Button } from "../button/button";

const ButtonsPagination = ({ handler, firstPage, lastPage }) => {
  return (
    <div className={buttonsPaginationStyle.buttons}>
      <Button
        content="&lt;"
        handler={handler}
        name="prev"
        isActive={!firstPage}
      />
      <Button
        content="&gt;"
        handler={handler}
        name="next"
        isActive={!lastPage}
      />
    </div>
  );
};

export { ButtonsPagination };
