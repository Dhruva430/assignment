type Props = {
  label: string;
};

function CustomInput(props: Props) {
  return (
    <div className="relative mt-5 w-full ">
      <input
        type="text"
        placeholder="123"
        className=" peer w-full border border-gray-200 focus:border-blue-500 rounded-md  py-3 placeholder-transparent focus:outline-none p-4"
      ></input>
      <label
        htmlFor="name"
        className="absolute text-xs left-3 -top-2 transition-all  peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 text-gray-500 bg-white px-1 pointer-events-none
        peer-placeholder-shown:text-sm
        "
      >
        {props.label}
      </label>
    </div>
  );
}

export default CustomInput;
