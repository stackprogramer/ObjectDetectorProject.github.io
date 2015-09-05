%Object Detector programed by R.Borumandi  Shiraz University
%Easy training New Model - 2015 15 August
function varargout = ObjectDetector(varargin)
% OBJECTDETECTOR MATLAB code for ObjectDetector.fig
%      OBJECTDETECTOR, by itself, creates a new OBJECTDETECTOR or raises the existing
%      singleton*.
%
%      H = OBJECTDETECTOR returns the handle to a new OBJECTDETECTOR or the handle to
%      the existing singleton*.
%
%      OBJECTDETECTOR('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in OBJECTDETECTOR.M with the given input arguments.
%
%      OBJECTDETECTOR('Property','Value',...) creates a new OBJECTDETECTOR or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before ObjectDetector_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to ObjectDetector_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help ObjectDetector

% Last Modified by GUIDE v2.5 14-Aug-2015 11:02:12

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @ObjectDetector_OpeningFcn, ...
                   'gui_OutputFcn',  @ObjectDetector_OutputFcn, ...
                   'gui_LayoutFcn',  [] , ...
                   'gui_Callback',   []);
if nargin && ischar(varargin{1})
    gui_State.gui_Callback = str2func(varargin{1});
end

if nargout
    [varargout{1:nargout}] = gui_mainfcn(gui_State, varargin{:});
else
    gui_mainfcn(gui_State, varargin{:});
end
% End initialization code - DO NOT EDIT

% --- Executes just before ObjectDetector is made visible.
function ObjectDetector_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to ObjectDetector (see VARARGIN)

% Choose default command line output for ObjectDetector
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes ObjectDetector wait for user response (see UIRESUME)
% uiwait(handles.axesImage);


% --- Outputs from this function are returned to the command line.
function varargout = ObjectDetector_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;

% --- Executes on button press in radiobuttonFace.
function radiobuttonFace_Callback(hObject, eventdata, handles)
% hObject    handle to radiobuttonFace (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of radiobuttonFace
global ModelName;   
global Title;
ModelName='ModelObjectXml/haarcascade_frontalface_alt.xml';
Title='Face Detected';

if (get(hObject,'Value') == get(hObject,'Max'))
	display('Selected');
    axes('Position',[0.3,0.7,0.4,.35])
imread('images/face.png');
imshow('images/face.png');
else
	display('Not selected');
    delete  axes;
end


% --- Executes on button press in radiobuttonEyes.
function radiobuttonEyes_Callback(hObject, eventdata, handles)
% hObject    handle to radiobuttonEyes (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of radiobuttonEyes
global ModelName;   
global Title;
ModelName='ModelObjectXml/haarcascade_eye_tree_eyeglasses.xml';
Title='Eyes Detected';
if (get(hObject,'Value') == get(hObject,'Max'))
	display('Selected');
    axes('Position',[0.3,0.7,0.4,.35])
imread('images/eyes.png');
imshow('images/eyes.png');
else
	display('Not selected');
    delete  axes;
end


% --- Executes on button press in radiobuttonNose.
function radiobuttonNose_Callback(hObject, eventdata, handles)
% hObject    handle to radiobuttonNose (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of radiobuttonNose
global ModelName;   
global Title;
ModelName='ModelObjectXml/haarcascade_mcs_nose.xml';
Title='Nose Detected';


if (get(hObject,'Value') == get(hObject,'Max'))
	display('Selected');
    axes('Position',[0.3,0.7,0.4,.35])
imread('images/nose.png');
imshow('images/nose.png');
else
	display('Not selected');
    delete  axes;
end





% --- Executes on button press in radiobuttonLip.
function radiobuttonLip_Callback(hObject, eventdata, handles)
% hObject    handle to radiobuttonLip (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of radiobuttonLip
global ModelName; 
global Title;
ModelName='ModelObjectXml/haarcascade_mcs_mouth.xml';
Title='Lip Detected';
if (get(hObject,'Value') == get(hObject,'Max'))
	display('Selected');
    axes('Position',[0.3,0.7,0.4,.35])
imread('images/lip.png');
imshow('images/lip.png');
else
	display('Not selected');
    delete  axes;
end

% --- Executes on button press in radiobuttonCar.
function radiobuttonCar_Callback(hObject, eventdata, handles)
% hObject    handle to radiobuttonCar (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of radiobuttonCar
global ModelName; 
global Title;

ModelName='ModelObjectXml/CarModel.xml';
Title='Car Detected';
if (get(hObject,'Value') == get(hObject,'Max'))
	display('Selected');
    axes('Position',[0.3,0.7,0.4,.35])
imread('images/car.png');
imshow('images/car.png');
else
	display('Not selected');
end


% --- Executes on button press in pushbuttonDetect.
function pushbuttonDetect_Callback(hObject, eventdata, handles)
% hObject    handle to pushbuttonDetect (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
global ModelName;
global PathImage;
global Title;





detector = vision.CascadeObjectDetector(ModelName);
img = imread(PathImage);
bbox = step(detector,img);
detectedImg = insertObjectAnnotation(img,'rectangle',bbox,Title);
figure;
imshow(detectedImg);


% --------------------------------------------------------------------
function file_Callback(hObject, eventdata, handles)
% hObject    handle to guide (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% --------------------------------------------------------------------
% --------------------------------------------------------------------
function help_Callback(hObject, eventdata, handles)
% hObject    handle to guide (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

function guide_Callback(hObject, eventdata, handles)
% hObject    handle to guide (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
open('help.pdf');

% --------------------------------------------------------------------
function about_Callback(hObject, eventdata, handles)
% hObject    handle to about (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
msgbox('programed by R.Borumandi,Shiraz University');

% --- Executes on button press in pushbutton2.
function pushbutton2_Callback(hObject, eventdata, handles)
% hObject    handle to pushbutton2 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)


% --- Executes on button press in pushbuttonTrain.
function pushbuttonTrain_Callback(hObject, eventdata, handles)
% hObject    handle to pushbuttonTrain (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
global MatFilePath;
global PosPath;
global negPath;

global Threshold;
global Num;
load(MatFilePath);
imDir = fullfile(PosPath);
addpath(imDir);
negativeFolder = fullfile(negPath);

 
positiveInstances= evalin('base', 'positiveInstances');

trainCascadeObjectDetector('ModelObject.xml',positiveInstances,negativeFolder,'FalseAlarmRate',Threshold,'NumCascadeStages',Num);
msgbox('training completed','training...');


% --- Executes on button press in togglebutton1.
function togglebutton1_Callback(hObject, eventdata, handles)
% hObject    handle to togglebutton1 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of togglebutton1






% --- Executes during object creation, after setting all properties.
function pathImage_CreateFcn(hObject, eventdata, handles)
% hObject    handle to pathImage (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit11_Callback(hObject, eventdata, handles)
% hObject    handle to edit11 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of edit11 as text
%        str2double(get(hObject,'String')) returns contents of edit11 as a double


% --- Executes during object creation, after setting all properties.
function edit11_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit11 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end








function threshold_Callback(hObject, eventdata, handles)
% hObject    handle to threshold (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of threshold as text
%        str2double(get(hObject,'String')) returns contents of threshold as a double
global Threshold;
strerror=get(hObject, 'String');
Threshold =str2double(strerror);

% --- Executes during object creation, after setting all properties.
function threshold_CreateFcn(hObject, eventdata, handles)
% hObject    handle to threshold (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function numberStage_Callback(hObject, eventdata, handles)
% hObject    handle to numberStage (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of numberStage as text
%        str2double(get(hObject,'String')) returns contents of numberStage as a double
global Num;
 
 strNum=get(hObject, 'String');
 disp(strNum);
 Num=str2num(strNum);

% --- Executes during object creation, after setting all properties.
function numberStage_CreateFcn(hObject, eventdata, handles)
% hObject    handle to numberStage (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on button press in export.
function export_Callback(hObject, eventdata, handles)
% hObject    handle to export (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
run('trainingImageLabeler');





% --- Executes on button press in newModel.
function newModel_Callback(hObject, eventdata, handles)
% hObject    handle to newModel (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of newModel
global Title;
Title='New Model';
if (get(hObject,'Value') == get(hObject,'Max'))
	display('Selected');
    axes('Position',[0.3,0.7,0.4,.35])
imread('images/new.png');
imshow('images/new.png');
else
	display('Not selected');
end


% --- Executes on button press in attachImg.
function attachImg_Callback(hObject, eventdata, handles)
% hObject    handle to attachImg (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
global PathImage;
[filename,filepath]=uigetfile({'*.*','All Files'},...
  'Select image for Detecttion');
PathImage = strcat(filepath,filename);
set(handles.text8, 'String', PathImage);
 


% --- Executes on button press in attachNewModel.
function attachNewModel_Callback(hObject, eventdata, handles)
% hObject    handle to attachNewModel (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
global ModelName;
[filename,filepath]=uigetfile({'*.*','All Files'},...
  'Select image for Detecttion');
ModelName = strcat(filepath,filename);
set(handles.text10, 'String',ModelName );


% --- Executes on button press in LoadMatFile.
function LoadMatFile_Callback(hObject, eventdata, handles)
% hObject    handle to LoadMatFile (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

global MatFilePath;

[filename,filepath]=uigetfile({'*.*','All Files'},...
  'select Matfile ');
MatFilePath = strcat(filepath,filename);
set(handles.text11, 'String',MatFilePath );


% --- Executes on button press in loadPos.
function loadPos_Callback(hObject, eventdata, handles)
% hObject    handle to loadPos (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

global PosPath;


fodername=uigetdir('C:\','please select pos folder');
PosPath =fodername;
set(handles.text12, 'String',PosPath );


% --- Executes on button press in loadNeg.
function loadNeg_Callback(hObject, eventdata, handles)
% hObject    handle to loadNeg (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

global negPath;

fodername=uigetdir('C:\','please select neg folder');
negPath =fodername;
set(handles.text13, 'String',negPath);


% --- Executes during object creation, after setting all properties.
function loadNeg_CreateFcn(hObject, eventdata, handles)
% hObject    handle to loadNeg (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called


% --- Executes during object creation, after setting all properties.
function radiobuttonFace_CreateFcn(hObject, eventdata, handles)
% hObject    handle to radiobuttonFace (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called
global ModelName;   
global Title;
ModelName='ModelObjectXml/haarcascade_frontalface_alt.xml';
Title='Face Detected';

if (get(hObject,'Value') == get(hObject,'Max'))
	display('Selected');
    axes('Position',[0.3,0.7,0.4,.35])
imread('images/face.png');
imshow('images/face.png');
else
	display('Not selected');
    delete  axes;
end
