import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function InfosFormGiftCardsComponent({
  onSubmit,
  onChange,
  formData,
  giftCard,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
  });

  // ✅ IMPORTANT: quand formData change (restore localStorage), on reset le form RHF
  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  const handleFieldChange = (fieldName) => (e) => {
    onChange({
      [fieldName]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  // ✅ onSubmit reçoit les valeurs RHF (plus fiable)
  const submit = (values) => {
    // sync parent (au cas où)
    onChange(values);
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {/* Champ Bénéficiaire */}
      <div>
        <label
          htmlFor="beneficiaryFirstName"
          className="block desktop:text-lg font-semibold mb-2"
        >
          Bénéficiaire
        </label>

        <div className="flex gap-4">
          <input
            id="beneficiaryFirstName"
            type="text"
            placeholder="Prénom du bénéficiaire"
            {...register("beneficiaryFirstName", { required: true })}
            className={`border rounded-lg w-full p-2 text-lg max-w-56 ${
              errors.beneficiaryFirstName ? "border-red" : ""
            }`}
            onChange={handleFieldChange("beneficiaryFirstName")}
          />
          <input
            id="beneficiaryLastName"
            type="text"
            placeholder="Nom du bénéficiaire"
            {...register("beneficiaryLastName", { required: true })}
            className={`border rounded-lg w-full p-2 text-lg max-w-56 ${
              errors.beneficiaryLastName ? "border-red" : ""
            }`}
            onChange={handleFieldChange("beneficiaryLastName")}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="sender"
          className="block desktop:text-lg font-semibold mb-2"
        >
          De la part de{" "}
        </label>

        <input
          id="sender"
          type="text"
          placeholder="Écrire ..."
          {...register("sender", { required: true })}
          className={`border rounded-lg w-full p-2 text-lg max-w-[465px] ${
            errors.sender ? "border-red" : ""
          }`}
          onChange={handleFieldChange("sender")}
        />
      </div>

      {/* Champ Commentaire */}
      <div>
        <label
          htmlFor="comment"
          className="block desktop:text-lg font-semibold mb-2"
        >
          Ajouter un commentaire sur la carte{" "}
          <span className="text-sm italic opacity-30">(facultatif)</span>
        </label>
        <textarea
          id="comment"
          placeholder="Votre commentaire"
          {...register("comment")}
          className="border rounded-lg w-full p-2 text-lg resize-none"
          onChange={handleFieldChange("comment")}
          maxLength={80}
        />
      </div>

      {/* Checkbox Masquer le prix */}
      {giftCard?.description && (
        <div className="flex items-center gap-2">
          <input
            id="hidePrice"
            type="checkbox"
            {...register("hidePrice")}
            className="w-5 h-5"
            onChange={handleFieldChange("hidePrice")}
          />
          <label htmlFor="hidePrice" className="desktop:text-lg">
            Masquer le prix lors de l'envoi du bon cadeau
          </label>
        </div>
      )}

      {/* Champ Votre email */}
      <div>
        <label
          htmlFor="sendEmail"
          className="block desktop:text-lg font-semibold mb-2"
        >
          Saisissez votre adresse mail
        </label>

        <input
          id="sendEmail"
          type="email"
          placeholder="Adresse email"
          {...register("sendEmail", { required: true })}
          className={`border rounded-lg w-full p-2 text-lg ${
            errors.sendEmail ? "border-red" : ""
          }`}
          onChange={handleFieldChange("sendEmail")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="underline uppercase">Important</p>

        <p className="italic">
          La carte cadeau est{" "}
          <strong className="uppercase underline">
            valide jusqu'au 28 février 2026
          </strong>
          . Une fois le paiement effectué, la carte cadeau sera envoyée par mail
          à l'adresse renseignée ci-dessus. Cet email contiendra également un
          code unique à transmettre directement au restaurant le jour
          d'utilisation de la carte cadeau.
        </p>
      </div>

      {/* Bouton Valider */}
      <button
        type="submit"
        className="w-full py-2 px-4 rounded-lg text-extraWhite text-lg bg-grey"
      >
        Procéder au paiement
      </button>
    </form>
  );
}
