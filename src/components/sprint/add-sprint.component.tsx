import * as React from 'react';
import { Modal, Grid, Input, Button } from 'semantic-ui-react';
import { DateRangePicker } from 'react-dates';

export interface AddSprintProps {
  show: boolean;
  onModalClose: () => void;
  onAddSprint: (sprint: any) => void;
}

const AddSprint: React.FC<AddSprintProps> = ({
  show,
  onModalClose,
  onAddSprint,
}) => {
  const [startDate, setStartDate] = React.useState<moment.Moment|null>(null);;
  const [focusedDate, setfocusedDate] = React.useState<'startDate'|'endDate'|null>(null);
  const [endDate, setEndDate] = React.useState<moment.Moment|null>(null);
  const [name, setName] = React.useState('');
  const [prefix, setPrefix] = React.useState('');

  const handleSubmit = () => {
    onAddSprint({
      name,
      prefix,
      endDate: endDate?.toDate(),
      startDate: startDate?.toDate(),
    });

    setStartDate(null);
    setEndDate(null);
    setName('');
    setPrefix('');

    onModalClose();
  };

  return (
    <Modal
      centered={false}
      open={show}
      onClose={onModalClose}
      closeOnEscape={true}
      closeIcon={true}
    >
    <Modal.Header>
      Add Sprint
    </Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Input
                placeholder={'Sprint Name'}
                style={{
                  paddingLeft: '5px',
                  paddingRight: '5px',
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <DateRangePicker
                startDate={startDate}
                startDateId={"startDate"}
                endDate={endDate}
                endDateId={"endDate"}
                onDatesChange={({ startDate: startDateInput, endDate: endDateInput }) => {
                  if (startDateInput) {
                    setStartDate(startDateInput);
                  }

                  if (endDateInput) {
                    setEndDate(endDateInput);
                  }
                }}
                onClose={() => {
                  setfocusedDate(null);
                }}
                focusedInput={focusedDate}
                onFocusChange={(focus) => {
                  if (focus) {
                    setfocusedDate(focus);
                  }
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Input
                placeholder={'Prefix'}
                style={{
                  paddingLeft: '5px',
                  paddingRight: '5px',
                }}
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button
                style={{
                  marginLeft: '5px',
                  marginRight: '5px',
                }}
                onClick={handleSubmit}
                className="button green"
              >
                Save
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Description>
    </Modal.Content>
  </Modal>
  );
};

export default AddSprint;
