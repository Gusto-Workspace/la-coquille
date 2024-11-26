import { useForm, Controller } from "react-hook-form";

export default function InfosFormGiftCardsComponent({
  onSubmit,
  onChange,
  formData,
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: formData, 
  });

  const handleFieldChange = (fieldName) => (e) => {
    onChange({
      [fieldName]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Champ Bénéficiaire */}
      <div>
        <label
          htmlFor="beneficiary"
          className="block desktop:text-lg font-semibold mb-2"
        >
          Bénéficiaire
        </label>

        <div className="flex gap-4">
          <input
            id="beneficiary"
            type="text"
            placeholder="Prénom du bénéficiaire"
            {...register("beneficiaryFirstName", { required: true })}
            className={`border rounded-lg w-full p-2 text-lg max-w-56 ${
              errors.beneficiary ? "border-red" : ""
            }`}
            onChange={handleFieldChange("beneficiaryFirstName")}
          />
          <input
            id="beneficiary"
            type="text"
            placeholder="Nom du bénéficiaire"
            {...register("beneficiaryLastName", { required: true })}
            className={`border rounded-lg w-full p-2 text-lg max-w-56 ${
              errors.beneficiary ? "border-red" : ""
            }`}
            onChange={handleFieldChange("beneficiaryLastName")}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="beneficiary"
          className="block desktop:text-lg font-semibold mb-2"
        >
          De la part de{" "}
          <span className="text-sm italic opacity-30">(falcultatif)</span>
        </label>

        <input
          id="beneficiary"
          type="text"
          placeholder="Écrire ..."
          {...register("sender", { required: true })}
          className={`border rounded-lg w-full p-2 text-lg max-w-[465px] ${
            errors.beneficiary ? "border-red" : ""
          }`}
          onChange={handleFieldChange("sender")}
        />
      </div>

      {/* Champ Email du Bénéficiaire */}
      <div>
        <label htmlFor="sendEmail" className="block desktop:text-lg font-semibold mb-2">
          À quelle adresse mail voulez-vous envoyer la carte ?
        </label>
        <input
          id="sendEmail"
          type="email"
          placeholder="Adresse mail"
          {...register("sendEmail", { required: true })}
          className={`border rounded-lg w-full p-2 text-lg ${
            errors.sendEmail ? "border-red" : ""
          }`}
          onChange={handleFieldChange("sendEmail")}
        />
      </div>

      {/* Champ Commentaire */}
      <div>
        <label htmlFor="comment" className="block desktop:text-lg font-semibold mb-2">
          Ajouter un commentaire sur la carte{" "}
          <span className="text-sm italic opacity-30">(falcultatif)</span>
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

      {/* Checkbox Recevoir une copie */}
      <div className="flex items-center gap-2">
        <input
          id="sendCopy"
          type="checkbox"
          {...register("sendCopy")}
          className="w-5 h-5"
          onChange={handleFieldChange("sendCopy")}
          checked={formData.sendCopy}
        />
        <label htmlFor="sendCopy" className="desktop:text-lg">
          Ajouter un destinataire
        </label>
      </div>

      {/* Champ Votre email */}
      {formData.sendCopy && (
        <div>
          <label
            htmlFor="copyEmail"
            className="block desktop:text-lg font-semibold mb-2"
          >
            Adresse email pour copie
          </label>
          <input
            id="copyEmail"
            type="email"
            placeholder="Adresse email"
            {...register("copyEmail", { required: true })}
            className={`border rounded-lg w-full p-2 text-lg ${
              errors.copyEmail ? "border-red" : ""
            }`}
            onChange={handleFieldChange("copyEmail")}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="underline">Important</p>

        <p className="italic">
          La carte cadeau a une durée de validité de 6 mois. Une fois le
          paiement effectué, la carte cadeau sera envoyée par mail à l'adresse
          renseignée ci-dessus. Cet email contiendra également un code unique à
          transmettre directement au restaurant le jour d'utiliation de la carte
          cadeau
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
