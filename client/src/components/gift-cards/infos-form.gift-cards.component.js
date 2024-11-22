import { useForm } from "react-hook-form";

export default function InfosFormGiftCardsComponent({
  onSubmit,
  onChange,
  formData,
}) {
  const {
    register,
    handleSubmit,
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
          className="block text-lg font-semibold mb-2"
        >
          Bénéficiaire
        </label>
        <input
          id="beneficiary"
          type="text"
          {...register("beneficiary", { required: true })}
          placeholder="Nom du bénéficiaire"
          className={`border rounded-lg w-full p-2 text-lg ${
            errors.beneficiary ? "border-red" : ""
          }`}
          onChange={handleFieldChange("beneficiary")}
        />
      </div>

      {/* Champ Email du Bénéficiaire */}
      <div>
        <label
          htmlFor="beneficiaryEmail"
          className="block text-lg font-semibold"
        >
          À quelle adresse mail voulez vous envoyer la carte ?
        </label>
        <input
          id="beneficiaryEmail"
          type="email"
          {...register("sendEmail", { required: true })}
          placeholder="Adresse mail"
          className={`border rounded-lg w-full p-2 text-lg ${
            errors.beneficiaryEmail ? "border-red" : ""
          }`}
          onChange={handleFieldChange("beneficiaryEmail")}
        />
      </div>

      {/* Champ Commentaire */}
      <div>
        <label htmlFor="comment" className="block text-lg font-semibold mb-2">
          Ajouter un commentaire sur la carte
        </label>
        <textarea
          id="comment"
          {...register("comment")}
          placeholder="Votre commentaire"
          className="border rounded-lg w-full p-2 text-lg resize-none"
          onChange={handleFieldChange("comment")}
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
        <label htmlFor="hidePrice" className="text-lg">
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
        <label htmlFor="sendCopy" className="text-lg">
          Ajouter un destinataire
        </label>
      </div>

      {/* Champ Votre email */}
      {formData.sendCopy && ( // Utilisation de formData pour garantir l'affichage correct
        <div>
          <input
            id="yourEmail"
            type="email"
            {...register("copyEmail", { required: true })}
            placeholder="Adresse email"
            className={`border rounded-lg w-full p-2 text-lg ${
              errors.yourEmail ? "border-red" : ""
            }`}
            onChange={handleFieldChange("yourEmail")}
          />
        </div>
      )}

      {/* Bouton Valider */}
      <button
        type="submit"
        className="w-full py-2 px-4 rounded-lg text-white text-lg bg-grey"
      >
        Passer au paiement
      </button>
    </form>
  );
}
