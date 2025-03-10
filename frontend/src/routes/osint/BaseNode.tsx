import { ChevronUpDownIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { Combobox } from '@headlessui/react';
import classNames from 'classnames';
import { ChangeEvent, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { GripIcon, Icon } from '@/components/Icons';
import { toast } from 'react-toastify';

export type NodeTypes =
  | 'dropdown'
  | 'text'
  | 'number'
  | 'decimal'
  | 'upload'
  | 'title'
  | 'section'
  | 'image'
  | 'video'
  | 'json'
  | 'list'
  | 'table'
  | 'copy-text'
  | 'copy-code'
  | 'empty';

export interface NodeInput {
  type: NodeTypes;
  label: string;
  style: React.CSSProperties;
  placeholder: string;
  options?: DropdownOption[];
  value?: string;
  icon?: any;
  title?: string;
  subtitle?: string;
  text?: string;
}

var dropdownKey = 0;

const getKey = () => {
  dropdownKey += 1;
  return `k_${dropdownKey}`;
};

var nodeKey = 0;

const getNodeKey = () => {
  nodeKey += 1;
  return `k_${nodeKey}`;
};

const handleStyle = { borderColor: '#60666A' };

export default function BaseNode({ flow, sendJsonMessage }: { flow: any; sendJsonMessage: Function }) {
  const node = flow?.data?.node;
  const nodes = node?.elements;
  const icon = node?.icon;
  const name = node?.name;
  const label = node?.label;
  const color = node?.color;
  const style = node?.style || {};

  const getNodeElement = (element: NodeInput, key: string | null = getNodeKey()) => {
    if (element.type === 'dropdown') {
      return (
        <DropdownInput
          key={key}
          sendJsonMessage={sendJsonMessage}
          nodeId={flow.id}
          options={element?.options || []}
          label={element?.label}
          value={element?.value}
        />
      );
    }
    if (element.type === 'text') {
      return (
        <TextInput
          key={key}
          nodeId={flow.id}
          label={element?.label}
          initialValue={element?.value || ''}
          icon={element?.icon || 'ballpen'}
          sendJsonMessage={sendJsonMessage}
        />
      );
    }
    if (element.type === 'upload') {
      return (
        <UploadFileInput
          key={key}
          nodeId={flow.id}
          label={element?.label}
          initialValue={element?.value || ''}
          icon={element?.icon || 'file-upload'}
          sendJsonMessage={sendJsonMessage}
        />
      );
    }
    if (element.type === 'title') {
      return (
        <Title
          key={key}
          nodeId={flow.id}
          label={element?.label}
          title={element?.title || ''}
          subtitle={element?.subtitle || ''}
          text={element?.text || ''}
        />
      );
    }
    if (element.type === 'section') {
      return <Text key={key} nodeId={flow.id} label={element?.label} value={element?.value || ''} />;
    }
    if (element.type === 'copy-text') {
      return <CopyText key={key} nodeId={flow.id} label={element?.label} value={element?.value || ''} />;
    }
    if (element.type === 'empty') {
      return <div className='hidden' />;
    }
  };

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' style={handleStyle} />
      <Handle position={Position.Top} id='t1' key='t1' type='source' style={handleStyle} />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' style={handleStyle} />
      <Handle position={Position.Left} id='l1' key='l1' type='target' style={handleStyle} />
      <div data-node-type={label} className='node container' style={style}>
        <div className='highlight' />
        <div
          style={{
            backgroundColor: color?.length === 7 ? `${color}80` : color ? color : '#145070',
          }}
          className='header'
        >
          <GripIcon />
          <div className='text-container'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>
              <span className='text-[0.5rem] text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flow.id}
            </p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display font-bold'>{name}</p>
          </div>
          <Icon icon={icon} className='h-5 w-5 mr-2' />
        </div>
        <form
          style={style}
          onSubmit={(event) => event.preventDefault()}
          className={classNames('elements gap-x-1', nodes.length > 2 ? '' : '')}
        >
          {nodes.map((element: NodeInput) => {
            if (Array.isArray(element))
              return (
                <>
                  {element.map((elm) => (
                    <div key={getNodeKey()} className='flex flex-col mr-2 last:mr-0'>
                      {getNodeElement(elm, null)}
                    </div>
                  ))}
                </>
              );
            return getNodeElement(element);
          })}
        </form>
      </div>
    </>
  );
}

export function CopyText({ nodeId, label, value }: { nodeId: string; label: string; value: string }) {
  return (
    <div
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success('Copied to clipboard!');
      }}
      className='flex items-center max-w-xs'
    >
      <PaperClipIcon className='w-4 h-4 text-inherit text-info-200 shrink-0' />
      <p
        title='Click to copy'
        data-type='link'
        className='ml-2 text-xs text-inherit break-keep whitespace-nowrap text-info-300 truncate'
      >
        {value}
      </p>
      <input type='text' className='hidden' data-node value={value} readOnly />
    </div>
  );
}

export function Text({ nodeId, label, value, icon }: { nodeId: string; label: string; value: string; icon?: any }) {
  return (
    <div className='w-full flex flex-col px-2 pb-1'>
      <p className='text-xs text-slate-300 whitespace-wrap font-medium'>{label}</p>
      <div className=' w-full flex relative text-slate-500 text-xs sm:text-sm'>
        {icon && <Icon icon={icon} className='h-6 w-6' />}
        <p className='text-xs text-slate-400 truncate'>{value}</p>
        <input data-node className='hidden' readOnly value={value} />
      </div>
    </div>
  );
}

export function Title({
  nodeId,
  label,
  title,
  subtitle,
  text,
}: {
  nodeId: string;
  label: string;
  title: string;
  subtitle: string;
  text: string;
}) {
  return (
    <div className='node-display'>
      {title && <h1 data-type='title'>{title}</h1>}
      {subtitle && <h2 data-type='subtitle'>{subtitle}</h2>}
      {text && <p data-type='text'>{text}</p>}
      <input className='hidden' readOnly data-node value={title} />
      <input className='hidden' readOnly data-node value={subtitle} />
      <input className='hidden' readOnly data-node value={text} />
    </div>
  );
}

export function UploadFileInput({
  nodeId,
  initialValue,
  label,
  sendJsonMessage,
  icon,
}: {
  nodeId: string;
  label: string;
  initialValue: string;
  sendJsonMessage: Function;
  icon?: any;
}) {
  const [value, setValue] = useState<File>(initialValue as any);

  const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files && event?.target?.files?.length > 0) {
      const file = event.target.files[0];
      setValue(file);
      sendJsonMessage({ action: 'update:node', node: { id: nodeId, [label]: file, name: file?.name || 'unknown' } });
    }
  };

  return (
    <>
      <p className='text-[0.5rem] ml-1 text-slate-400 whitespace-wrap font-semibold font-display mt-1'>{label}</p>
      <div className='flex items-center mb-1'>
        <div className='node-field'>
          <Icon icon={icon} className='h-6 w-6' />
          <label className={classNames('ml-5 w-52', value?.name && 'text-slate-400')}>
            <input type='file' data-node onChange={(event: any) => updateValue(event)} />
            {value?.name ? value.name : label}
          </label>
        </div>
      </div>
    </>
  );
}

export function TextInput({
  nodeId,
  initialValue,
  label,
  sendJsonMessage,
  icon,
}: {
  nodeId: string;
  label: string;
  initialValue: string;
  sendJsonMessage: Function;
  icon?: any;
}) {
  const [value, setValue] = useState(initialValue);

  const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    sendJsonMessage({ action: 'update:node', node: { id: nodeId, [label]: event.target.value } });
  };

  return (
    <>
      <div className='flex flex-col'>
        <p className='text-[0.5rem] ml-1 text-slate-400 whitespace-wrap font-semibold font-display mt-1'>{label}</p>
        <div className='flex items-center mb-1'>
          <div className='node-field'>
            <Icon icon={icon} className='h-6 w-6' />
            <input type='text' data-node onChange={(event: any) => updateValue(event)} value={value} />
          </div>
        </div>
      </div>
    </>
  );
}

export interface DropdownOption {
  label: string;
  tooltip: string;
}

export function DropdownInput({
  options,
  label,
  nodeId,
  sendJsonMessage,
  value,
}: {
  nodeId: string;
  options: DropdownOption[];
  label: string;
  sendJsonMessage: Function;
  value: JSONObject;
}) {
  const [query, setQuery] = useState('');
  const filteredOptions =
    query === ''
      ? options ?? []
      : options?.filter((option: any) => {
          return option.label.toLowerCase().includes(query.toLowerCase());
        }) ?? [];
  const [activeOption, setActiveOption] = useState(value);

  useEffect(() => {
    sendJsonMessage({
      action: 'update:node',
      node: { id: nodeId, [label]: activeOption },
    });
  }, [activeOption]);

  return (
    <>
      <Combobox className='w-full z-[999] dropdown-input' as='div' value={activeOption} onChange={setActiveOption}>
        <Combobox.Label>
          <p className='text-[0.5rem] ml-1 text-slate-400 whitespace-wrap font-semibold font-display mt-1'>{label}</p>
        </Combobox.Label>
        <div className='relative mt-1'>
          <Combobox.Input
            className='mt-1 w-full flex py-0.5 relative border-opacity-60 text-xs border border-info-400 bg-slate-700 sm:text-sm pl-2 -z-10 text-slate-200'
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(option: DropdownOption) => option.label}
          />
          <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
            <ChevronUpDownIcon className='h-5 w-5 text-slate-400' aria-hidden='true' />
          </Combobox.Button>

          {filteredOptions.length > 0 && (
            <Combobox.Options className='absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-b-md bg-dark-400 py-1 text-base shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none sm:text-sm'>
              {filteredOptions.map((option: DropdownOption) => (
                <Combobox.Option
                  key={getKey()}
                  value={option}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                      active ? 'bg-slate-900 text-slate-300' : 'text-slate-400'
                    )
                  }
                >
                  {({ active, selected }) => (
                    <span
                      className={classNames('block truncate pl-2')}
                      title={option?.tooltip !== option.label ? option.tooltip : 'No description found'}
                    >
                      {option.label}
                    </span>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
        <input data-node readOnly value={JSON.stringify(activeOption)} className='hidden invisible' />
      </Combobox>
    </>
  );
}
