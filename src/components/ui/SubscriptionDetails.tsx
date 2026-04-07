interface SubscriptionDetailsProps {
  title: string;
  price: number;
  priceUnit: string;
  benefits: string[];
  buttonText: string;
  onButtonClick: () => void;
}

export default function SubscriptionDetails({ title, price, priceUnit, benefits, buttonText, onButtonClick }: SubscriptionDetailsProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 w-72 flex flex-col">
      <h3 className="font-primary text-xl mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-primary">${price.toFixed(2)}</span>
        <span className="text-sm font-secondary text-text-secondary">{priceUnit}</span>
      </div>
      <ul className="space-y-2 flex-1 mb-6">
        {benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            <span className="font-secondary text-sm text-text-secondary">{b}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onButtonClick}
        className="w-full py-3 rounded-xl bg-selected text-black font-secondary font-medium text-sm cursor-pointer border-none hover:opacity-90 transition-opacity"
      >
        {buttonText}
      </button>
    </div>
  );
}
