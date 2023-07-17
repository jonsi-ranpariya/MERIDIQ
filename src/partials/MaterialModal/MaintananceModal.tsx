import { useEffect, useState } from "react";
import strings from "../../lang/Lang";
import Button from '@components/form/Button';
import Modal from "./Modal";


function MaintananceModal() {

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, [])

  return (
    <Modal
      open={open}
      title={strings.maintanance}
      handleClose={() => setOpen(false)}
      submitButton={
        <Button
          fullWidth
          className=""
          onClick={() => setOpen(false)}
        >
          {strings.Okay}
        </Button>
      }
    >
      <div className="p-4 text-center">
        <h4 className="text-xl font-semibold mb-1">MERIDIQ Server upgrade on Sunday March 13th</h4>
        <h5 className="text-lg font-medium mb-6">from 04:30 to 10:30 CET</h5>
        <p className="px-4 mb-2">Dear all! please note that MERIDIQ will be offline this coming Sunday for security and server upgrade.</p>
        <p className="">The system will not be available from 04:30 to 10:30 CET.</p>
      </div>
    </Modal>
  )
}

export default MaintananceModal
