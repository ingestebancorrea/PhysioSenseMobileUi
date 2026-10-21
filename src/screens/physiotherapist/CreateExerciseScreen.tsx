import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Minus, Plus, UploadCloud, Trash2, type LucideIcon } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';
import type { ExerciseItem } from '@/components/exercises/ExerciseCard';
import { StepIndicator } from '@/components/exercises/StepIndicator';
import { mediaService } from '@/services/media/mediaService';
import type { PickedMedia } from '@/services/media/mediaService';
import { exerciseService } from '@/services/exerciseService';
import { getExercise } from '@/services/exercise/exerciseDetail.service';
import type { SaveExercisePayload } from '@/types/exercise.dto';
import type { ExerciseResponseDto } from '@/types/exercise.dto';
import { toExerciseItem } from '@/services/exercise/exerciseList.service';
import { describeError } from '@/utils/describeError';
import { ExerciseVideoPreview } from '@/components/exercise-detail/ExerciseVideoPreview';
import { ExerciseSpecsCard } from '@/components/exercise-detail/ExerciseSpecsCard';
import { TargetMusclesCard } from '@/components/exercise-detail/TargetMusclesCard';
import { useAppAlert } from '@/hooks/useAppAlert';
import { useAppToast } from '@/context/ToastContext';
import { AppLoader } from '@/components/common/appLoader/AppLoader';
import { Button } from '@/components/common/button/Button';
import {
  buildExercisePreview,
  buildPreviewThumbnail,
  formatVideoDuration,
} from './previewMapper';

interface MuscleOption {
  label: string;
  icon: LucideIcon;
}

const MUSCLE_OPTIONS: MuscleOption[] = [
  { label: 'Flexores de los dedos', icon: ICONS.hand },
  { label: 'Extensores de los dedos', icon: ICONS.repeat },
  { label: 'Flexor largo del pulgar', icon: ICONS.grip },
  { label: 'Oponente del pulgar', icon: ICONS.refreshCcw },
  { label: 'Músculos de la muñeca', icon: ICONS.activity },
  { label: 'Flexores de la muñeca', icon: ICONS.arrowDown },
  { label: 'Extensores de la muñeca', icon: ICONS.arrowUp },
  { label: 'Interóseos y lumbricales', icon: ICONS.repeat2 },
];

const DEFAULT_REQUIREMENTS = [
  { id: 'req_1', text: 'Usa el guante correctamente' },
  { id: 'req_2', text: 'Mantén la muñeca alineada con el antebrazo' },
  { id: 'req_3', text: 'Realiza cada repetición de forma lenta y controlada' },
];

/** Músculos que la pantalla ofrece como chip. */
const KNOWN_MUSCLE_LABELS = new Set(
  MUSCLE_OPTIONS.map(option => option.label),
);

interface RequirementItem {
  id: string;
  text: string;
}

export interface CreateExerciseScreenProps {
  onBack?: () => void;
  initialExercise?: ExerciseItem | null;
  onSaved?: (exercise: ExerciseItem) => void;
}

type FieldName = 'title' | 'description' | 'video' | 'cover';
type FieldErrors = Partial<Record<FieldName, string>>;

export const CreateExerciseScreen: React.FC<CreateExerciseScreenProps> = ({
  onBack,
  initialExercise,
  onSaved,
}) => {
  const isEditing = Boolean(initialExercise);
  /** Código estable del ejercicio que se está editando. */
  const exerciseRef = initialExercise?.id;

  const { alertModal, showAlert } = useAppAlert();
  const { showToast } = useAppToast();

  // Control del Stepper (1: Información, 2: Configuración, 3: Revisión)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  // Carga del ejercicio que se está editando.
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Estados del Formulario. En el alta arrancan con los valores por defecto;
  // en la edición los completa la API (ver `loadExercise`).
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [series, setSeries] = useState<number>(3);
  const [reps, setReps] = useState<number>(15);
  const [rest, setRest] = useState<number>(30);

  const [video, setVideo] = useState<PickedMedia | null>(null);
  const [coverImage, setCoverImage] = useState<PickedMedia | null>(null);

  const [requirements, setRequirements] = useState<RequirementItem[]>(DEFAULT_REQUIREMENTS);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [extraMuscles, setExtraMuscles] = useState<string[]>([]);
  const [newMuscle, setNewMuscle] = useState('');
  const [muscleModalVisible, setMuscleModalVisible] = useState(false);
  const [requirementModalVisible, setRequirementModalVisible] = useState(false);
  const [newRequirementText, setNewRequirementText] = useState('');

  const BackIcon = ICONS.arrowLeft;
  const PlusIcon = ICONS.plus;
  const TrashIcon = ICONS.trash;
  const CheckIcon = ICONS.check;
  const PlayIcon = ICONS.play;
  const ImageIcon = ICONS.image;
  const RepeatIcon = ICONS.repeat2;
  const ClockIcon = ICONS.clock;
  const WarningIcon = ICONS.triangleAlert;

  const clearFieldError = (field: FieldName) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handlePickVideo = async () => {
    try {
      const picked = await mediaService.pickVideo();
      if (picked) {
        setVideo(picked);
        clearFieldError('video');
      }
    } catch (error) {
      showAlert({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'No se pudo seleccionar el video.',
        variant: 'error',
      });
    }
  };

  const handlePickCover = async () => {
    try {
      const picked = await mediaService.pickCoverImage();
      if (picked) {
        setCoverImage(picked);
        clearFieldError('cover');
      }
    } catch (error) {
      showAlert({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'No se pudo seleccionar la imagen.',
        variant: 'error',
      });
    }
  };

  const handleAddRequirement = () => {
    setNewRequirementText('');
    setRequirementModalVisible(true);
  };

  const handleConfirmRequirement = () => {
    const text = newRequirementText.trim();
    if (!text) return;
    const newReq: RequirementItem = {
      id: Date.now().toString(),
      text,
    };
    setRequirements((prev) => [...prev, newReq]);
    setNewRequirementText('');
    setRequirementModalVisible(false);
  };

  const handleUpdateRequirement = (id: string, text: string) => {
    setRequirements((prev) => prev.map((req) => (req.id === id ? { ...req, text } : req)));
  };

  const handleRemoveRequirement = (id: string) => {
    setRequirements((prev) => prev.filter((req) => req.id !== id));
  };

  const handleToggleMuscle = (muscle: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((item) => item !== muscle) : [...prev, muscle],
    );
  };

  const handleOpenMuscleModal = () => {
    setNewMuscle('');
    setMuscleModalVisible(true);
  };

  const handleConfirmMuscle = () => {
    const name = newMuscle.trim();
    if (!name) return;
    setExtraMuscles((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setSelectedMuscles((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setNewMuscle('');
    setMuscleModalVisible(false);
  };

  const validateStepOne = (): boolean => {
    setErrors({});
    return true;
  };

  /**
   * Sube el video y la portada si son archivos locales y devuelve las URLs
   * remotas que espera el backend. Si ya vienen de una edición anterior
   * (`media.url`), se reusan tal cual.
   */
  const resolveMediaUrls = async (): Promise<{
    videoUrl: string;
    coverImageUrl: string;
  }> => {
    const videoUrl = video?.uri
      ? (await exerciseService.uploadVideo(video)).url
      : (video?.url ?? '');

    const coverImageUrl = coverImage?.uri
      ? (await exerciseService.uploadCoverImage(coverImage)).url
      : (coverImage?.url ?? '');

    return { videoUrl, coverImageUrl };
  };

  /**
   * Llena el formulario con el ejercicio que se está editando.
   *
   * El listado sólo trae un resumen (id, título, series, reps, duración), así
   * que para editar hay que pedir el ejercicio completo: los requisitos, los
   * músculos, las instrucciones y el media vienen de la API, no de datos
   * quemados.
   */
  const loadExercise = useCallback(async () => {
    if (!exerciseRef) {
      return;
    }

    setLoadingExercise(true);
    setLoadError(null);

    try {
      const dto: ExerciseResponseDto = await getExercise(exerciseRef);

      setTitle(dto.title);
      setDescription(dto.description ?? '');
      setInstructions(dto.instructions ?? '');
      setSeries(dto.series);
      setReps(dto.reps);
      setRest(dto.restSeconds);
      setRequirements(
        (dto.requirements ?? []).map((text, index) => ({
          id: `req_${index + 1}`,
          text,
        })),
      );
      setSelectedMuscles(dto.targetMuscles ?? []);
      // Los músculos que no están en la lista fija también tienen que verse:
      // si no, quedarían seleccionados pero sin chip que los muestre.
      setExtraMuscles(
        (dto.targetMuscles ?? []).filter(
          label => !KNOWN_MUSCLE_LABELS.has(label),
        ),
      );
      // El media remoto se reusa: `resolveMediaUrls` no lo vuelve a subir.
      setVideo(dto.video_url ? { url: dto.video_url } : null);
      setCoverImage(dto.cover_image_url ? { url: dto.cover_image_url } : null);
    } catch (err) {
      const message = describeError(err);

      setLoadError(message);
      showAlert({
        title: 'No se pudo cargar el ejercicio',
        message,
        variant: 'error',
      });
    } finally {
      setLoadingExercise(false);
    }
  }, [exerciseRef, showAlert]);

  useEffect(() => {
    loadExercise();
  }, [loadExercise]);

  const handleSave = async () => {
    if (!validateStepOne()) {
      setCurrentStep(1);
      return;
    }

    setSaving(true);
    try {
      const { videoUrl, coverImageUrl } = await resolveMediaUrls();

      const payload: SaveExercisePayload = {
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        series,
        reps,
        restSeconds: rest,
        requirements: requirements.map((req) => req.text.trim()).filter(Boolean),
        targetMuscles: selectedMuscles,
        videoUrl,
        coverImageUrl,
      };

      // El backend responde el DTO del ejercicio guardado; se mapea a
      // `ExerciseItem` para que la lista lo muestre tal como vino.
      const saved = isEditing && exerciseRef
        ? await exerciseService.updateExercise(exerciseRef, payload)
        : await exerciseService.createExercise(payload);

      const item = toExerciseItem(saved);

      // El éxito es un aviso flotante, no un modal: no frena la pantalla. El
      // aviso vive en el provider, así que sobrevive al salto al listado y se
      // sigue viendo mientras el GET vuelve a cargar el catálogo.
      showToast({
        title: isEditing ? 'Ejercicio actualizado' : 'Ejercicio creado',
        message: `"${item.title}" se guardó correctamente.`,
        variant: 'success',
      });

      onSaved?.(item);
      onBack?.();
    } catch (err) {
      // Si falla, el modal explica por qué y el usuario se queda en el
      // formulario para poder volver a intentarlo.
      showAlert({
        title: 'No se pudo guardar el ejercicio',
        message: describeError(err),
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStepOne()) {
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    handleSave();
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack?.();
    }
  };

  const videoSource = video?.uri ? { uri: video.uri } : video?.url ? { uri: video.url } : null;

  const muscleOptions: MuscleOption[] = [
    ...MUSCLE_OPTIONS,
    ...extraMuscles.map((label) => ({ label, icon: ICONS.dumbbell })),
  ];

  const previewDetail = buildExercisePreview({
    title,
    description,
    series,
    reps,
    rest,
    requirements: requirements.map((req) => req.text.trim()).filter(Boolean),
    targetMuscles: selectedMuscles,
    coverImage,
    videoDuration: video?.duration,
  });
  const previewThumbnail = buildPreviewThumbnail(coverImage);

  const previewMuscleIcons = muscleOptions.reduce<Record<string, LucideIcon>>((acc, m) => {
    acc[m.label] = m.icon;
    return acc;
  }, {});

  // Mientras se carga el ejercicio no se pinta el formulario: se verían los
  // valores por defecto y no los del ejercicio que se está editando.
  if (isEditing && loadingExercise) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <AppLoader />
        </View>
      </SafeAreaView>
    );
  }

  // Si el ejercicio no se pudo cargar no se puede editar: sin los datos
  // completos el PUT mandaría un cuerpo incompleto.
  if (isEditing && loadError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.loadErrorText}>{loadError}</Text>
          <Button title="Reintentar" onPress={loadExercise} variant="primary" />
          <Button title="Volver" onPress={() => onBack?.()} variant="secondary" />
        </View>
        {alertModal}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevStep} style={styles.backButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <BackIcon color="#1A1C20" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar ejercicio' : 'Crear ejercicio'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Stepper Indicator */}
      <StepIndicator currentStep={currentStep} />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* PASO 1: INFORMACIÓN */}
        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Información básica</Text>

            <Text style={styles.inputLabel}>Nombre del ejercicio</Text>
            <TextInput
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                clearFieldError('title');
              }}
              placeholder="Ej. Cerrar la mano"
              placeholderTextColor="#8E94A0"
              style={styles.textInput}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

            <Text style={styles.inputLabel}>Descripción</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  clearFieldError('description');
                }}
                placeholder="Explica brevemente el objetivo del ejercicio..."
                placeholderTextColor="#8E94A0"
                style={styles.textArea}
                multiline
                numberOfLines={3}
                maxLength={200}
                textAlignVertical="top"
              />
              <Text style={styles.charCounter}>{description.length}/200</Text>
            </View>
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

            {/* Video Demostrativo */}
            <Text style={styles.inputLabel}>Video demostrativo</Text>
            {!video ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handlePickVideo}
                  style={styles.uploadDropzone}
                >
                  <View style={styles.uploadIconCircle}>
                    {PlayIcon && <PlayIcon size={18} color={COLORS.primary} />}
                  </View>
                  <View style={styles.uploadTextWrapper}>
                    <Text style={styles.uploadTitle}>Selecciona o sube un video</Text>
                    <Text style={styles.uploadSubtitle}>Formato recomendado: MP4 (máx. 100MB)</Text>
                  </View>
                </TouchableOpacity>
                {errors.video && <Text style={styles.errorText}>{errors.video}</Text>}
              </>
            ) : (
              <>
                <View style={styles.mediaPreviewRow}>
                  <View style={styles.videoThumbnailWrapper}>
                    {videoSource ? (
                      <Image
                        source={videoSource}
                        style={styles.videoThumbnail}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.videoPlaceholder}>
                        {PlayIcon && <PlayIcon size={20} color={COLORS.primary} />}
                      </View>
                    )}
                    {video.duration ? (
                      <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>{formatVideoDuration(video.duration)}</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.mediaInfo}>
                    <Text numberOfLines={1} style={styles.fileNameText}>
                      {video.fileName ?? 'Video cargado'}
                    </Text>
                    <TouchableOpacity
                      onPress={handlePickVideo}
                      style={styles.mediaActionButton}
                      activeOpacity={0.8}
                    >
                      <UploadCloud size={18} color={COLORS.primary} />
                      <Text style={styles.replaceText}>Reemplazar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setVideo(null)}
                      style={[styles.mediaActionButton, styles.deleteMediaBtn]}
                      activeOpacity={0.8}
                    >
                      <Trash2 size={18} color="#EF4444" />
                      <Text style={styles.deleteText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {errors.video && <Text style={styles.errorText}>{errors.video}</Text>}
              </>
            )}

            {/* Imagen de Portada */}
            <Text style={styles.inputLabel}>Imagen de portada</Text>
            {!coverImage ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handlePickCover}
                  style={styles.uploadDropzone}
                >
                  <View style={styles.uploadIconCircle}>
                    {ImageIcon && <ImageIcon size={18} color={COLORS.primary} />}
                  </View>
                  <View style={styles.uploadTextWrapper}>
                    <Text style={styles.uploadTitle}>Selecciona o sube una imagen</Text>
                    <Text style={styles.uploadSubtitle}>Formato recomendado: PNG o JPG (máx. 5MB)</Text>
                  </View>
                </TouchableOpacity>
                {errors.cover && <Text style={styles.errorText}>{errors.cover}</Text>}
              </>
            ) : (
              <>
                <View style={styles.mediaPreviewRow}>
                  <View style={styles.videoThumbnailWrapper}>
                    <Image
                      source={{ uri: coverImage.uri ?? coverImage.url ?? '' }}
                      style={styles.videoThumbnail}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.mediaInfo}>
                    <Text numberOfLines={1} style={styles.fileNameText}>
                      {coverImage.fileName ?? 'Imagen cargada'}
                    </Text>
                    <TouchableOpacity
                      onPress={handlePickCover}
                      style={styles.mediaActionButton}
                      activeOpacity={0.8}
                    >
                      <UploadCloud size={18} color={COLORS.primary} />
                      <Text style={styles.replaceText}>Reemplazar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setCoverImage(null)}
                      style={[styles.mediaActionButton, styles.deleteMediaBtn]}
                      activeOpacity={0.8}
                    >
                      <Trash2 size={18} color="#EF4444" />
                      <Text style={styles.deleteText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {errors.cover && <Text style={styles.errorText}>{errors.cover}</Text>}
              </>
            )}

            {/* Contadores (Series, Repeticiones, Descanso) */}
            <Text style={styles.inputLabel}>Parámetros</Text>
            <View style={styles.countersRow}>
              <View style={styles.counterItem}>
                <View style={styles.counterLabelRow}>
                  {RepeatIcon && <RepeatIcon size={14} color="#4538B0" />}
                  <Text style={styles.counterLabel}>Series</Text>
                </View>
                <View style={styles.pickerBox}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setSeries(Math.max(1, series - 1))}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Minus size={18} color={series <= 1 ? COLORS.divider : COLORS.primary} />
                  </TouchableOpacity>
                  <View style={styles.pickerValueWrap}>
                    <Text style={styles.pickerVal}>{series}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setSeries(series + 1)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Plus size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.counterItem}>
                <View style={styles.counterLabelRow}>
                  {CheckIcon && <CheckIcon size={14} color="#4538B0" />}
                  <Text style={styles.counterLabel}>Repeticiones por serie</Text>
                </View>
                <View style={styles.pickerBox}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setReps(Math.max(1, reps - 1))}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Minus size={18} color={reps <= 1 ? COLORS.divider : COLORS.primary} />
                  </TouchableOpacity>
                  <View style={styles.pickerValueWrap}>
                    <Text style={styles.pickerVal}>{reps}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setReps(reps + 1)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Plus size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.counterItemFull}>
              <View style={styles.counterLabelRow}>
                {ClockIcon && <ClockIcon size={14} color="#4538B0" />}
                <Text style={styles.counterLabel}>Descanso (seg)</Text>
              </View>
<View style={styles.pickerBox}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setRest(Math.max(5, rest - 5))}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Minus size={18} color={rest <= 5 ? COLORS.divider : COLORS.primary} />
                  </TouchableOpacity>
                  <View style={styles.pickerValueWrap}>
                    <Text style={styles.pickerVal}>{rest}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setRest(rest + 5)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Plus size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
            </View>
          </View>
        )}

        {/* PASO 2: REQUISITOS */}
        {currentStep === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Requisitos</Text>

            <View style={styles.reqTable}>
              {requirements.map((req, index) => (
                <View
                  key={req.id}
                  style={[styles.requirementRow, index < requirements.length - 1 && styles.reqRowDivider]}
                >
                  <View style={styles.checkIconCircle}>
                    {CheckIcon && <CheckIcon size={13} color="#2ECC71" />}
                  </View>
                  <TextInput
                    value={req.text}
                    onChangeText={(text) => handleUpdateRequirement(req.id, text)}
                    style={styles.reqInput}
                    placeholder="Escribe un requisito..."
                    placeholderTextColor="#8E94A0"
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveRequirement(req.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.reqDeleteBtn}
                  >
                    {TrashIcon && <TrashIcon size={17} color="#EF4444" />}
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleAddRequirement}
              style={styles.addRequirementButton}
              activeOpacity={0.8}
            >
              {PlusIcon && <PlusIcon size={16} color="#4538B0" />}
              <Text style={styles.addRequirementText}>Agregar requisito</Text>
            </TouchableOpacity>

            <Text style={[styles.inputLabel, styles.marginTop16]}>Músculos objetivo</Text>
            <View style={styles.chipsContainer}>
              {muscleOptions.map((muscle) => {
                const isSelected = selectedMuscles.includes(muscle.label);
                const MuscleIcon = muscle.icon;
                return (
                  <TouchableOpacity
                    key={muscle.label}
                    activeOpacity={0.7}
                    onPress={() => handleToggleMuscle(muscle.label)}
                    style={[styles.muscleChip, isSelected && styles.muscleChipSelected]}
                  >
                    <MuscleIcon size={18} color={isSelected ? '#FFFFFF' : COLORS.primary} />
                    <Text style={[styles.muscleChipText, isSelected && styles.muscleChipTextSelected]}>
                      {muscle.label}
                    </Text>
                    {isSelected && CheckIcon && <CheckIcon size={14} color="#FFFFFF" />}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={handleOpenMuscleModal}
              style={styles.addRequirementButton}
              activeOpacity={0.8}
            >
              {PlusIcon && <PlusIcon size={16} color="#4538B0" />}
              <Text style={styles.addRequirementText}>Agregar músculo objetivo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* PASO 3: REVISIÓN (vista previa del paciente) */}
        {currentStep === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Esto es lo que verá tu paciente</Text>
            <ExerciseVideoPreview
              thumbnail={previewThumbnail}
              duration={previewDetail.videoDuration}
              sourceUri={video?.uri ?? video?.url ?? null}
              posterUri={coverImage?.uri ?? coverImage?.url ?? null}
            />
            {title.trim() ? <Text style={styles.previewTitle}>{title.trim()}</Text> : null}
            {description.trim() ? (
              <Text style={styles.previewDesc}>{description.trim()}</Text>
            ) : null}
            <ExerciseSpecsCard specs={previewDetail.specs} />
            {!video && (
              <View style={styles.noVideoWarning}>
                {WarningIcon && <WarningIcon size={18} color={COLORS.primaryViolet} />}
                <Text style={styles.noVideoWarningText}>
                  No agregaste el video demostrativo. El paciente verá el ejercicio sin video.
                </Text>
              </View>
            )}
            {selectedMuscles.length > 0 && (
              <TargetMusclesCard
                muscles={previewDetail.targetMuscles}
                muscleIcons={previewMuscleIcons}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer de Navegación */}
      <View style={styles.footer}>
        {currentStep === 1 ? (
          <TouchableOpacity
            onPress={handleNextStep}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <View style={styles.nextContent}>
              <Text style={styles.primaryButtonText}>Siguiente</Text>
              <Text style={styles.nextArrow}>›</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.dualButtons}>
            <TouchableOpacity
              onPress={handlePrevStep}
              style={[styles.secondaryButton, saving && styles.buttonDisabled]}
              disabled={saving}
              activeOpacity={0.8}
            >
              <View style={styles.prevContent}>
                <Text style={styles.prevArrow}>‹</Text>
                <Text style={styles.secondaryButtonText}>Anterior</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNextStep}
              style={[styles.primaryButtonFlex, saving && styles.buttonDisabled]}
              disabled={saving}
              activeOpacity={0.8}
            >
              {currentStep === 3 ? (
                saving ? (
                  <View style={styles.saveContent}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.primaryButtonText}>Guardando...</Text>
                  </View>
                ) : (
                  <View style={styles.saveContent}>
                    <CheckIcon size={18} color="#FFFFFF" />
                    <Text style={styles.primaryButtonText}>Guardar ejercicio</Text>
                  </View>
                )
              ) : (
                <View style={styles.nextContent}>
                  <Text style={styles.primaryButtonText}>Siguiente</Text>
                  <Text style={styles.nextArrow}>›</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal Nuevo Músculo */}
      <Modal
        visible={muscleModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMuscleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nuevo músculo objetivo</Text>
            <TextInput
              value={newMuscle}
              onChangeText={setNewMuscle}
              placeholder="Ej. Oponente del pulgar"
              placeholderTextColor="#8E94A0"
              style={styles.modalInput}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleConfirmMuscle}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setMuscleModalVisible(false)}
                style={styles.modalCancelBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmMuscle}
                style={styles.modalConfirmBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.modalConfirmText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Nuevo Requisito */}
      <Modal
        visible={requirementModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRequirementModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nuevo requisito</Text>
            <TextInput
              value={newRequirementText}
              onChangeText={setNewRequirementText}
              placeholder="Escribe el requisito..."
              placeholderTextColor="#8E94A0"
              style={styles.modalInput}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleConfirmRequirement}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setRequirementModalVisible(false)}
                style={styles.modalCancelBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmRequirement}
                style={styles.modalConfirmBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.modalConfirmText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {alertModal}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  loadErrorText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  backButton: {
    padding: 4,
  },
  headerSpacer: {
    width: 28,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1C20',
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  stepContent: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C20',
    marginBottom: 4,
  },
  previewTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1C20',
  },
  previewDesc: {
    fontSize: 14,
    lineHeight: 21,
    color: '#6B7280',
  },
  noVideoWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryVioletSoft,
    borderWidth: 1,
    borderColor: 'rgba(108, 92, 231, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  noVideoWarningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.primaryDark,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1C20',
    marginTop: 8,
  },
  requiredMark: {
    color: '#E5484D',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
  },
  marginTop16: {
    marginTop: 16,
  },

  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBECEF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1C20',
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBECEF',
    borderRadius: 12,
    padding: 12,
  },
  textArea: {
    height: 80,
    fontSize: 14,
    color: '#1A1C20',
  },
  charCounter: {
    fontSize: 10,
    color: '#8E94A0',
    textAlign: 'right',
    marginTop: 4,
  },

  uploadDropzone: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBECEF',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 58,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  uploadIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTextWrapper: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1C20',
  },
  uploadSubtitle: {
    fontSize: 11,
    color: '#8E94A0',
  },

  mediaPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  videoThumbnailWrapper: {
    flex: 1,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F5F6F8',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  mediaInfo: {
    flex: 1,
    gap: 8,
  },
  fileNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1C20',
  },
  mediaActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBECEF',
    backgroundColor: '#FFFFFF',
  },
  deleteMediaBtn: {
    borderColor: '#EBECEF',
    backgroundColor: '#FFFFFF',
  },
  replaceText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },

  countersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  counterItem: {
    flex: 1,
  },
  counterItemFull: {
    width: '100%',
  },
  counterLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 7,
  },
  counterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  pickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBECEF',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 44,
    gap: 8,
  },
  pickerButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  pickerValueWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C20',
  },

  reqTable: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBECEF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    minHeight: 48,
    gap: 10,
  },
  reqRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EBECEF',
  },
  checkIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#2ECC71',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqInput: {
    flex: 1,
    fontSize: 13,
    color: '#1A1C20',
    fontWeight: '500',
    padding: 0,
  },
  reqDeleteBtn: {
    padding: 4,
  },
  addRequirementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0EDFF',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  addRequirementText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4538B0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C20',
  },
  modalInput: {
    backgroundColor: '#FAFAFC',
    borderWidth: 1,
    borderColor: '#EBECEF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1C20',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#EBECEF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalCancelText: {
    color: '#1A1C20',
    fontSize: 14,
    fontWeight: '600',
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0EDFF',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 24,
  },
  muscleChipSelected: {
    backgroundColor: COLORS.primary,
  },
  muscleChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  muscleChipTextSelected: {
    color: '#FFFFFF',
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 36,
    backgroundColor: '#FAFAFC',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  nextContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextArrow: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
  },
  prevContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  prevArrow: {
    color: '#1A1C20',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
  },
  dualButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#EBECEF',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#1A1C20',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButtonFlex: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});