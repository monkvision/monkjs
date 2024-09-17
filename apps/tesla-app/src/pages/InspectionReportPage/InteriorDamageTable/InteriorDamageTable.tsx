import { Button, Icon } from '@monkvision/common-ui-web';
import { useMonkTheme } from '@monkvision/common';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Card, CardContent, CardFooter } from '../../../components/ui/card';

const styles = {
  // container: {
  //   // width: '300px',
  //   margin: 'auto',
  //   textAlign: 'center' as const,
  //   fontFamily: 'Arial, sans-serif',
  // },
  // tabsHeader: {
  //   display: 'flex',
  //   marginBottom: '20px',
  //   justifyContent: 'center',
  // },
  button: {
    padding: '10px 20px',
    border: 'solid rgba(1, 1, 1, .2)',
    cursor: 'pointer',
    fontSize: '16px',
    color: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: '20px',
    width: '20px',
  },
};

interface InteriorDamage {
  area: string;
  damage_type: string;
  repair_cost: number | null;
}
export interface InteriorDamageTableProps {
  onAddDamage?: () => void;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
  damages?: InteriorDamage[];
}

export function InteriorDamageTable({
  onAddDamage,
  onEdit = () => {},
  onDelete = () => {},
  damages,
}: InteriorDamageTableProps) {
  const { palette } = useMonkTheme();

  return (
    <>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Area</TableHead>
                <TableHead>Damage types</TableHead>
                <TableHead className='text-right'>Deductions</TableHead>
                <TableHead className='w-[20px]'></TableHead>
              </TableRow>
            </TableHeader>
            {/* {damages && ( */}
            <TableBody>
              {damages?.map((d, index) => {
                return (
                  <TableRow>
                    <TableCell className='font-medium'>{d.area}</TableCell>
                    <TableCell>{d.damage_type}</TableCell>
                    <TableCell className='text-right'>${d.repair_cost}</TableCell>
                    <TableCell className='w-[60px] flex flex-row'>
                      <button onClick={() => onEdit(index)}>
                        <Icon style={styles.icon} icon='more-vertical' />
                      </button>
                      <button onClick={() => onDelete(index)}>
                        <Icon style={styles.icon} icon='delete' />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            {/* ) */}
          </Table>
        </CardContent>
        <CardFooter className='justify-center border-t p-4'>
          {/* <Button size="sm" variant="ghost" className="gap-1"> */}
          {/*   <PlusCircle className="h-3.5 w-3.5" /> */}
          {/*   Add Variant */}
          {/* </Button> */}
          <Button
            variant='outline'
            style={{ borderRadius: '9px' }}
            primaryColor={palette.background.light}
            secondaryColor={palette.text.white}
            onClick={onAddDamage}
          >
            ADD DAMAGE
          </Button>
        </CardFooter>
      </Card>
      {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}> */}
      {/*   <Button primaryColor={palette.background.light} icon='add'> */}
      {/*     Damage */}
      {/*   </Button> */}
      {/* </div> */}
    </>
  );
}
