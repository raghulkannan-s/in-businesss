
interface Props {
    name: string;
    icon?: React.ReactNode;
}

const SideBarBtn = ({ name, icon }: Props) => (
    <div className="p-2 text-lg text-gray-300 font-bold flex-co text-center flex justify-center items-center gap-1">
        {icon && <div>{icon}</div>}
        <div>{name}</div>
    </div>
);

export default SideBarBtn;
